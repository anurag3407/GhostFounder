import { NextResponse } from 'next/server';
import InvestorGhoul from '@/lib/agents/investor-ghoul';
import connectDB from '@/lib/mongodb/connect';
import User from '@/models/User';

// Random VC motivation/criticism messages sent during business hours
// POST /api/cron/random-vc-message
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
    const agent = new InvestorGhoul();

    // Get current hour (UTC)
    const now = new Date();
    const hour = now.getUTCHours();
    
    // Only send during business hours (9 AM - 6 PM UTC)
    if (hour < 9 || hour > 18) {
      return NextResponse.json({
        success: true,
        message: 'Outside business hours, no messages sent',
        skipped: true
      });
    }

    // 30% chance to send messages (to avoid being too spammy)
    if (Math.random() > 0.3) {
      return NextResponse.json({
        success: true,
        message: 'Random check passed, no messages this time',
        skipped: true
      });
    }

    // Get users who have opted in for VC motivation
    const users = await User.find({ 
      isActive: { $ne: false },
      'preferences.vcMotivation': true,
      phoneNumber: { $exists: true, $ne: null }
    }).select('_id email phoneNumber displayName');

    const results = {
      sent: 0,
      failed: 0,
      errors: []
    };

    // Send random message to each eligible user
    for (const user of users) {
      try {
        await agent.generateRandomMessage(user._id.toString());
        results.sent++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          userId: user._id.toString(),
          error: error.message
        });
      }
    }

    console.log(`💀 Random VC messages: ${results.sent} sent, ${results.failed} failed`);

    return NextResponse.json({
      success: true,
      message: 'Random VC messages processed',
      results
    });

  } catch (error) {
    console.error('Random VC Message Cron Error:', error);
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
    endpoint: 'random-vc-message',
    status: 'active',
    schedule: '3 times daily (9 AM, 1 PM, 5 PM UTC)',
    agent: 'Investor Ghoul',
    description: 'Sends random tough love motivation messages to opted-in users'
  });
}
