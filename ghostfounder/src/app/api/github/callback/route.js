/**
 * GitHub OAuth Callback Route
 * 
 * Handles the OAuth callback and exchanges code for access token
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connect';
import User from '@/models/User';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?error=github_auth_failed`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?error=no_code`
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/api/github/callback'
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub token error:', tokenData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?error=token_exchange_failed`
      );
    }

    const accessToken = tokenData.access_token;

    // Get GitHub user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const githubUser = await userResponse.json();

    // Connect to database and update user
    await connectDB();

    // TODO: Get the current user's Firebase UID from session/cookie
    // For now, we'll store the GitHub data and redirect
    // In production, you'd link this to the logged-in user

    // Store GitHub connection info (you'd typically do this for the logged-in user)
    const githubData = {
      githubId: githubUser.id,
      githubUsername: githubUser.login,
      githubAccessToken: accessToken,
      githubAvatarUrl: githubUser.avatar_url,
      githubConnectedAt: new Date()
    };

    // In production, update the user record with the GitHub data
    // await User.findOneAndUpdate({ firebaseUid: userFirebaseUid }, { $set: githubData });

    // For now, redirect with success message
    const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    redirectUrl.searchParams.set('github_connected', 'true');
    redirectUrl.searchParams.set('github_username', githubUser.login);

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?error=oauth_failed`
    );
  }
}
