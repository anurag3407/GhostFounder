/**
 * GitHub OAuth Authorization Route
 * 
 * Initiates the GitHub OAuth flow
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/api/github/callback';
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'GitHub OAuth not configured' },
      { status: 500 }
    );
  }

  // Scopes needed for code review functionality
  const scopes = [
    'read:user',
    'user:email',
    'repo',
    'write:repo_hook'
  ].join(' ');

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('state', crypto.randomUUID());

  return NextResponse.redirect(authUrl.toString());
}
