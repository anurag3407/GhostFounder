import { NextResponse } from 'next/server';
import ShadowScout from '@/lib/agents/shadow-scout';
import connectDB from '@/lib/mongodb/connect';
import User from '@/models/User';
import Project from '@/models/Project';

// This endpoint should be called weekly by a cron service (Vercel Cron, etc.)
// POST /api/cron/weekly-spy
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
    const agent = new ShadowScout();

    // Get all active users with projects
    const users = await User.find({ 
      isActive: { $ne: false },
      'preferences.weeklySpyReport': { $ne: false }
    }).select('_id email');

    const results = {
      processed: 0,
      failed: 0,
      reports: [],
      errors: []
    };

    // Process spy reports for each user's projects
    for (const user of users) {
      try {
        // Get user's projects
        const projects = await Project.find({ 
          userId: user._id,
          isActive: { $ne: false }
        }).select('name description industry competitors');

        for (const project of projects) {
          try {
            const report = await agent.generateWeeklyReport(
              project.description || project.name,
              project.industry || 'Technology',
              project.competitors || [],
              user._id.toString()
            );

            results.reports.push({
              userId: user._id.toString(),
              projectId: project._id.toString(),
              reportId: report.reportId
            });
            results.processed++;
          } catch (projectError) {
            results.failed++;
            results.errors.push({
              userId: user._id.toString(),
              projectId: project._id.toString(),
              error: projectError.message
            });
          }
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          userId: user._id.toString(),
          error: error.message
        });
      }
    }

    console.log(`👁️ Weekly spy cron completed: ${results.processed} reports generated, ${results.failed} failed`);

    return NextResponse.json({
      success: true,
      message: 'Weekly spy report generation completed',
      results
    });

  } catch (error) {
    console.error('Weekly Spy Cron Error:', error);
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
    endpoint: 'weekly-spy',
    status: 'active',
    schedule: 'Weekly on Mondays at 6:00 AM UTC',
    agent: 'Shadow Scout'
  });
}
