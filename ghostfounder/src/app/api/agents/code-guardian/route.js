import { NextResponse } from 'next/server';
import { PhantomCodeGuardian } from '@/lib/agents';

const codeGuardian = new PhantomCodeGuardian();

/**
 * GET - Get review history for a user
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const firebaseUid = searchParams.get('firebaseUid');
    const reviewId = searchParams.get('reviewId');

    if (!firebaseUid && !reviewId) {
      return NextResponse.json(
        { error: 'Missing firebaseUid or reviewId' },
        { status: 400 }
      );
    }

    if (reviewId) {
      const review = await codeGuardian.getReview(reviewId);
      return NextResponse.json({ success: true, review });
    }

    const reviews = await codeGuardian.getReviewHistory(firebaseUid);
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Code review GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

/**
 * POST - Trigger a code review
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { repoName, prNumber, prTitle, prAuthor, prUrl, files, firebaseUid, email, displayName } = body;

    if (!repoName || !prNumber || !files || !firebaseUid) {
      return NextResponse.json(
        { error: 'Missing required fields: repoName, prNumber, files, firebaseUid' },
        { status: 400 }
      );
    }

    const result = await codeGuardian.execute({
      repoName,
      prNumber,
      prTitle,
      prAuthor,
      prUrl,
      files,
      firebaseUid,
      email,
      displayName,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Code review POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process code review', details: error.message },
      { status: 500 }
    );
  }
}
