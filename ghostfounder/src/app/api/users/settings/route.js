import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connect';
import User from '@/models/User';

// GET /api/users/settings - Get user settings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ firebaseUid: userId }).select({
      displayName: 1,
      email: 1,
      photoURL: 1,
      githubConnected: 1,
      githubUsername: 1,
      selectedRepo: 1,
      preferences: 1,
      blockchainWallet: 1,
      phoneNumber: 1
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        settings: {}
      });
    }

    const settings = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      githubConnected: user.githubConnected || false,
      githubUsername: user.githubUsername || '',
      selectedRepo: user.selectedRepo || '',
      walletAddress: user.blockchainWallet || '',
      phoneNumber: user.phoneNumber || '',
      // Notification preferences
      emailNotifications: user.preferences?.emailNotifications ?? true,
      whatsappNotifications: user.preferences?.whatsappNotifications ?? false,
      dailyNews: user.preferences?.dailyNews ?? true,
      weeklySpyReport: user.preferences?.weeklySpyReport ?? true,
      vcMotivation: user.preferences?.vcMotivation ?? false,
      criticalAlertsOnly: user.preferences?.criticalAlertsOnly ?? false,
      // UI preferences
      theme: user.preferences?.theme || 'dark',
      compactMode: user.preferences?.compactMode ?? false,
      showTokenUsage: user.preferences?.showTokenUsage ?? true
    };

    return NextResponse.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Failed to get settings', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/users/settings - Update user settings
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, settings } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const updateData = {
      displayName: settings.displayName,
      phoneNumber: settings.phoneNumber,
      blockchainWallet: settings.walletAddress,
      preferences: {
        emailNotifications: settings.emailNotifications,
        whatsappNotifications: settings.whatsappNotifications,
        dailyNews: settings.dailyNews,
        weeklySpyReport: settings.weeklySpyReport,
        vcMotivation: settings.vcMotivation,
        criticalAlertsOnly: settings.criticalAlertsOnly,
        theme: settings.theme,
        compactMode: settings.compactMode,
        showTokenUsage: settings.showTokenUsage
      },
      updatedAt: new Date()
    };

    const user = await User.findOneAndUpdate(
      { firebaseUid: userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      user: {
        id: user._id,
        displayName: user.displayName
      }
    });

  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings', details: error.message },
      { status: 500 }
    );
  }
}
