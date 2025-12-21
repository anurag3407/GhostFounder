import { NextResponse } from 'next/server';
import NewsBanshee from '@/lib/agents/news-banshee';
import connectDB from '@/lib/mongodb/connect';
import User from '@/models/User';

// This endpoint should be called daily by a cron service (Vercel Cron, etc.)
// POST /api/cron/daily-news
export async function POST(request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const agent = new NewsBanshee();

    // Get all active users
    const users = await User.find({ 
      isActive: { $ne: false },
      'preferences.dailyNews': { $ne: false }
    }).select('_id email preferences.newsKeywords preferences.newsCategories');

    const results = {
      processed: 0,
      failed: 0,
      errors: []
    };

    // Process news for each user
    for (const user of users) {
      try {
        await agent.fetchDailyNews(
          user.preferences?.newsKeywords || [],
          user.preferences?.newsCategories || ['startups', 'technology', 'funding'],
          user._id.toString()
        );
        results.processed++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          userId: user._id.toString(),
          error: error.message
        });
      }
    }

    console.log(`📰 Daily news cron completed: ${results.processed} users processed, ${results.failed} failed`);

    return NextResponse.json({
      success: true,
      message: 'Daily news aggregation completed',
      results
    });

  } catch (error) {
    console.error('Daily News Cron Error:', error);
    return NextResponse.json(
      { 
        error: 'Cron job failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET - Health check for the cron endpoint
export async function GET() {
  return NextResponse.json({
    endpoint: 'daily-news',
    status: 'active',
    schedule: 'Daily at 8:00 AM UTC',
    agent: 'News Banshee'
  });
}
