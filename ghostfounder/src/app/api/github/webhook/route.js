/**
 * GitHub Webhook Handler
 * 
 * Receives GitHub webhook events for pull requests and triggers code review
 */

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb/connect';
import PhantomCodeGuardian from '@/lib/agents/phantom-code-guardian';
import User from '@/models/User';

const agent = new PhantomCodeGuardian();

/**
 * Verify GitHub webhook signature
 */
function verifySignature(payload, signature) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) return true; // Skip verification if no secret configured
  
  const sig = `sha256=${crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')}`;
  
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(signature || ''));
}

/**
 * POST /api/github/webhook
 * 
 * Handle GitHub webhook events
 */
export async function POST(request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('x-hub-signature-256');
    const event = request.headers.get('x-github-event');
    const deliveryId = request.headers.get('x-github-delivery');

    console.log(`[GitHub Webhook] Event: ${event}, Delivery: ${deliveryId}`);

    // Verify signature
    if (!verifySignature(payload, signature)) {
      console.error('[GitHub Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const data = JSON.parse(payload);

    // Handle different event types
    switch (event) {
      case 'ping':
        return NextResponse.json({ message: 'pong' });

      case 'pull_request':
        return handlePullRequest(data);

      case 'push':
        return handlePush(data);

      case 'installation':
      case 'installation_repositories':
        return handleInstallation(data);

      default:
        console.log(`[GitHub Webhook] Unhandled event: ${event}`);
        return NextResponse.json({ message: `Event ${event} received but not handled` });
    }

  } catch (error) {
    console.error('[GitHub Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle pull request events
 */
async function handlePullRequest(data) {
  const { action, pull_request, repository, sender } = data;

  console.log(`[GitHub Webhook] PR ${action}: ${repository.full_name}#${pull_request.number}`);

  // Only trigger review on opened or synchronized (new commits pushed)
  if (!['opened', 'synchronize', 'reopened'].includes(action)) {
    return NextResponse.json({ 
      message: `PR action "${action}" does not require review` 
    });
  }

  try {
    await connectDB();

    // Find user by GitHub username
    const user = await User.findOne({ githubUsername: sender.login });

    if (!user) {
      console.log(`[GitHub Webhook] User not found for GitHub: ${sender.login}`);
      // Still process the review, just don't track to a specific user
    }

    // Trigger code review
    const reviewResult = await agent.execute({
      userId: user?._id,
      prData: {
        repository: repository.full_name,
        prNumber: pull_request.number,
        title: pull_request.title,
        description: pull_request.body,
        author: pull_request.user.login,
        branch: pull_request.head.ref,
        baseBranch: pull_request.base.ref,
        diffUrl: pull_request.diff_url,
        htmlUrl: pull_request.html_url,
        additions: pull_request.additions,
        deletions: pull_request.deletions,
        changedFiles: pull_request.changed_files
      },
      accessToken: user?.githubAccessToken
    });

    // Post review comment to PR (if we have access)
    if (user?.githubAccessToken && reviewResult.success) {
      await postReviewComment(
        user.githubAccessToken,
        repository.full_name,
        pull_request.number,
        reviewResult.review
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Code review triggered',
      reviewId: reviewResult.reviewId
    });

  } catch (error) {
    console.error('[GitHub Webhook] PR processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process pull request' },
      { status: 500 }
    );
  }
}

/**
 * Handle push events (for reference)
 */
async function handlePush(data) {
  const { repository, ref, commits, pusher } = data;
  
  console.log(`[GitHub Webhook] Push to ${repository.full_name}:${ref} by ${pusher.name}`);
  console.log(`[GitHub Webhook] ${commits?.length || 0} commit(s)`);

  // We don't trigger reviews on direct pushes, only on PRs
  return NextResponse.json({ 
    message: 'Push event received',
    ref,
    commits: commits?.length || 0
  });
}

/**
 * Handle installation events
 */
async function handleInstallation(data) {
  const { action, installation, repositories } = data;
  
  console.log(`[GitHub Webhook] Installation ${action}:`, installation?.id);
  
  if (repositories) {
    console.log(`[GitHub Webhook] Repositories:`, repositories.map(r => r.full_name));
  }

  return NextResponse.json({ 
    message: `Installation ${action}`,
    installationId: installation?.id
  });
}

/**
 * Post a review comment on the PR
 */
async function postReviewComment(accessToken, repoFullName, prNumber, review) {
  try {
    const [owner, repo] = repoFullName.split('/');
    
    // Create a review on the PR
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/reviews`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: formatReviewComment(review),
          event: review.approved ? 'APPROVE' : (review.hasBlockingIssues ? 'REQUEST_CHANGES' : 'COMMENT')
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('[GitHub Webhook] Failed to post review:', error);
    }

  } catch (error) {
    console.error('[GitHub Webhook] Error posting review:', error);
  }
}

/**
 * Format the review into a GitHub comment
 */
function formatReviewComment(review) {
  let comment = `## 👻 Phantom Code Guardian Review\n\n`;
  
  if (review.score) {
    comment += `**Code Quality Score:** ${review.score}/100\n\n`;
  }
  
  if (review.summary) {
    comment += `### Summary\n${review.summary}\n\n`;
  }
  
  if (review.issues && review.issues.length > 0) {
    comment += `### Issues Found\n`;
    review.issues.forEach((issue, i) => {
      const emoji = issue.severity === 'critical' ? '🔴' : 
                    issue.severity === 'high' ? '🟠' : 
                    issue.severity === 'medium' ? '🟡' : '🟢';
      comment += `${i + 1}. ${emoji} **${issue.severity.toUpperCase()}**: ${issue.message}\n`;
    });
    comment += '\n';
  }
  
  if (review.suggestions && review.suggestions.length > 0) {
    comment += `### Suggestions\n`;
    review.suggestions.forEach((suggestion, i) => {
      comment += `${i + 1}. ${suggestion}\n`;
    });
    comment += '\n';
  }
  
  comment += `---\n*Powered by [GhostFounder](https://ghostfounder.com) AI*`;
  
  return comment;
}
