import { BaseAgent } from './base-agent';
import { generateContent, GEMINI_MODELS } from '@/lib/gemini/config';
import { CodeReview } from '@/models';
import dbConnect from '@/lib/mongodb/connect';

const CODE_REVIEW_SYSTEM_PROMPT = `You are the Phantom Code Guardian, an expert code reviewer AI. Your role is to analyze pull request changes and provide comprehensive, actionable feedback.

Analyze the code changes and provide your review in the following JSON format:
{
  "summary": "A brief 2-3 sentence summary of the changes",
  "functions": [
    { "name": "functionName", "lines": "45-67", "description": "What this function does" }
  ],
  "bugs": [
    { "line": 123, "file": "path/to/file.js", "severity": "critical|warning|info", "description": "Description of the bug", "suggestion": "How to fix it" }
  ],
  "securityIssues": [
    { "line": 234, "file": "path/to/file.js", "severity": "critical|high|medium|low", "type": "SQL Injection|XSS|etc", "description": "Description", "recommendation": "How to fix" }
  ],
  "codeSmells": [
    { "line": 89, "file": "path/to/file.js", "type": "unused-variable|duplicate-code|etc", "description": "Description" }
  ],
  "suggestions": [
    { "category": "Performance|Readability|Best Practices|Testing", "description": "Suggestion", "priority": "high|medium|low" }
  ],
  "overallScore": 85
}

Rules:
1. Be thorough but constructive - provide actionable feedback
2. Prioritize security issues above all else
3. Score from 0-100 based on code quality, security, and best practices
4. Only include items you actually find - don't make up issues
5. Be specific with line numbers and file paths`;

/**
 * Phantom Code Guardian - Autonomous Code Review Agent
 * Analyzes GitHub PRs and provides detailed feedback
 */
export class PhantomCodeGuardian extends BaseAgent {
  constructor() {
    super('phantom-code-guardian', GEMINI_MODELS.CODE_REVIEW);
  }

  /**
   * Analyze a pull request
   * @param {object} input - PR data
   * @param {string} input.repoName - Repository name
   * @param {number} input.prNumber - PR number
   * @param {string} input.prTitle - PR title
   * @param {string} input.prAuthor - PR author
   * @param {string} input.prUrl - PR URL
   * @param {array} input.files - Array of { path, patch, additions, deletions }
   * @param {string} input.firebaseUid - User's Firebase UID
   */
  async execute(input) {
    this.startTimer();
    await dbConnect();

    const { repoName, prNumber, prTitle, prAuthor, prUrl, files, firebaseUid } = input;

    // Check if review already exists
    let review = await CodeReview.findOne({ repoName, prNumber });
    
    if (!review) {
      // Get or create user
      const user = await this.getOrCreateUser(firebaseUid, input.email, input.displayName);
      
      review = await CodeReview.create({
        userId: user._id,
        firebaseUid,
        repoName,
        prNumber,
        prTitle,
        prAuthor,
        prUrl,
        filesReviewed: files,
        status: 'processing',
      });
    } else {
      review.status = 'processing';
      await review.save();
    }

    try {
      // Build the prompt with file changes
      const prompt = this.buildPrompt(files);
      
      // Call Gemini for analysis
      const { text, usage } = await generateContent(this.modelName, prompt, {
        temperature: 0.3, // Lower for more consistent analysis
        maxOutputTokens: 4096,
      });

      // Parse the response
      const analysis = this.parseAnalysis(text);

      // Update review with analysis
      review.analysis = analysis;
      review.tokenUsage = {
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
        cost: usage.cost,
      };
      review.status = 'completed';
      review.completedAt = new Date();
      await review.save();

      // Log token usage
      await this.logUsage(firebaseUid, usage.totalTokens, usage.cost);

      // Send notifications
      await this.sendNotifications(firebaseUid, review);

      return {
        success: true,
        review: review.toObject(),
        executionTime: this.getExecutionTime(),
      };
    } catch (error) {
      review.status = 'failed';
      review.errorMessage = error.message;
      await review.save();
      
      throw error;
    }
  }

  /**
   * Build the prompt from file changes
   */
  buildPrompt(files) {
    let prompt = `${CODE_REVIEW_SYSTEM_PROMPT}\n\n`;
    prompt += `## Pull Request Changes\n\n`;

    for (const file of files) {
      prompt += `### File: ${file.path}\n`;
      prompt += `Additions: ${file.additions || 0}, Deletions: ${file.deletions || 0}\n\n`;
      prompt += '```diff\n';
      prompt += file.patch || 'No changes available';
      prompt += '\n```\n\n';
    }

    prompt += '\nProvide your analysis in the specified JSON format.';
    return prompt;
  }

  /**
   * Parse the AI response into structured analysis
   */
  parseAnalysis(text) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: return basic structure
      return {
        summary: text.substring(0, 500),
        functions: [],
        bugs: [],
        securityIssues: [],
        codeSmells: [],
        suggestions: [],
        overallScore: 50,
      };
    } catch (error) {
      console.error('Error parsing analysis:', error);
      return {
        summary: 'Analysis completed but parsing failed.',
        functions: [],
        bugs: [],
        securityIssues: [],
        codeSmells: [],
        suggestions: [],
        overallScore: 50,
      };
    }
  }

  /**
   * Send email and WhatsApp notifications
   */
  async sendNotifications(firebaseUid, review) {
    const hasCritical = 
      review.analysis.bugs?.some(b => b.severity === 'critical') ||
      review.analysis.securityIssues?.some(s => s.severity === 'critical' || s.severity === 'high');

    const emailHtml = this.generateEmailHtml(review, hasCritical);
    const whatsappMessage = this.generateWhatsAppMessage(review, hasCritical);

    await this.notify(firebaseUid, {
      email: {
        subject: `🛡️ Code Review: PR #${review.prNumber} in ${review.repoName}`,
        html: emailHtml,
      },
      whatsapp: hasCritical ? {
        message: whatsappMessage,
      } : null,
    });

    review.notifications = {
      emailSent: true,
      whatsappSent: hasCritical,
      sentAt: new Date(),
    };
    await review.save();
  }

  /**
   * Generate email HTML template
   */
  generateEmailHtml(review, hasCritical) {
    const { analysis, repoName, prNumber, prUrl, tokenUsage } = review;
    
    let bugsHtml = '';
    if (analysis.bugs?.length > 0) {
      bugsHtml = analysis.bugs.map(bug => `
        <li style="margin-bottom: 10px;">
          <span style="color: ${bug.severity === 'critical' ? '#ff3366' : bug.severity === 'warning' ? '#ffd700' : '#9ca3af'}; font-weight: bold;">
            ${bug.severity.toUpperCase()}
          </span>: ${bug.description} (${bug.file}:${bug.line})
          <br><em style="color: #00d4ff;">Fix: ${bug.suggestion}</em>
        </li>
      `).join('');
    }

    let securityHtml = '';
    if (analysis.securityIssues?.length > 0) {
      securityHtml = analysis.securityIssues.map(issue => `
        <li style="margin-bottom: 10px;">
          <span style="color: #ff3366; font-weight: bold;">🔒 ${issue.type}</span>: ${issue.description}
          <br><em style="color: #00d4ff;">Recommendation: ${issue.recommendation}</em>
        </li>
      `).join('');
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0f; color: #e8e8ed; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #12121a; border-radius: 12px; padding: 24px; }
        .header { text-align: center; margin-bottom: 24px; }
        .logo { color: #00d4ff; font-size: 24px; font-weight: bold; }
        .score { display: inline-block; padding: 8px 16px; border-radius: 50px; font-size: 20px; font-weight: bold; }
        .score-good { background: #00ff8820; color: #00ff88; }
        .score-warning { background: #ffd70020; color: #ffd700; }
        .score-bad { background: #ff336620; color: #ff3366; }
        h2 { color: #00d4ff; border-bottom: 1px solid #ffffff10; padding-bottom: 8px; }
        ul { padding-left: 20px; }
        .footer { margin-top: 24px; text-align: center; color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">👻 Phantom Code Guardian</div>
          <p style="color: #9ca3af;">Code Review Report</p>
        </div>
        
        <h2>PR #${prNumber}: ${review.prTitle || 'Pull Request'}</h2>
        <p><strong>Repository:</strong> ${repoName}</p>
        <p><a href="${prUrl}" style="color: #00d4ff;">View Pull Request →</a></p>
        
        <div style="text-align: center; margin: 20px 0;">
          <span class="score ${analysis.overallScore >= 80 ? 'score-good' : analysis.overallScore >= 60 ? 'score-warning' : 'score-bad'}">
            Score: ${analysis.overallScore}/100
          </span>
        </div>
        
        <h2>📋 Summary</h2>
        <p>${analysis.summary || 'No summary available.'}</p>
        
        ${analysis.functions?.length > 0 ? `
        <h2>✅ Functions Detected</h2>
        <ul>
          ${analysis.functions.map(f => `<li><strong>${f.name}</strong> (lines ${f.lines}): ${f.description}</li>`).join('')}
        </ul>
        ` : ''}
        
        ${analysis.bugs?.length > 0 ? `
        <h2>⚠️ Issues Found</h2>
        <ul>${bugsHtml}</ul>
        ` : '<h2>✅ No Bugs Found</h2>'}
        
        ${analysis.securityIssues?.length > 0 ? `
        <h2>🔒 Security Issues</h2>
        <ul>${securityHtml}</ul>
        ` : ''}
        
        ${analysis.suggestions?.length > 0 ? `
        <h2>💡 Suggestions</h2>
        <ul>
          ${analysis.suggestions.map(s => `<li><strong>[${s.priority}]</strong> ${s.description}</li>`).join('')}
        </ul>
        ` : ''}
        
        <div class="footer">
          <p>Token Usage: ${tokenUsage?.totalTokens || 0} tokens ($${tokenUsage?.cost?.toFixed(4) || '0.0000'})</p>
          <p>Powered by GhostFounder • Gemini 2.5</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Generate WhatsApp message for critical issues
   */
  generateWhatsAppMessage(review, hasCritical) {
    const { analysis, repoName, prNumber } = review;
    const criticalCount = (analysis.bugs?.filter(b => b.severity === 'critical').length || 0) +
                          (analysis.securityIssues?.filter(s => s.severity === 'critical' || s.severity === 'high').length || 0);

    return `🚨 *CRITICAL ALERT* - Phantom Code Guardian

PR #${prNumber} in ${repoName} has ${criticalCount} critical issue(s)!

Score: ${analysis.overallScore}/100

${analysis.securityIssues?.length > 0 ? `🔒 Security Issues: ${analysis.securityIssues.length}` : ''}
${analysis.bugs?.filter(b => b.severity === 'critical').length > 0 ? `🐛 Critical Bugs: ${analysis.bugs.filter(b => b.severity === 'critical').length}` : ''}

Check your email for the full report.

- GhostFounder 👻`;
  }

  /**
   * Get review history for a user
   */
  async getReviewHistory(firebaseUid, limit = 10) {
    await dbConnect();
    return CodeReview.find({ firebaseUid })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * Get a single review by ID
   */
  async getReview(reviewId) {
    await dbConnect();
    return CodeReview.findById(reviewId).lean();
  }
}

export default PhantomCodeGuardian;
