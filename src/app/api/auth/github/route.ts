import { NextResponse } from 'next/server';
import { getGitHubAuthUrl } from '@/lib/github';

// This route initiates the GitHub OAuth flow
export async function GET() {
  try {
    const authUrl = getGitHubAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating GitHub auth:', error);
    return NextResponse.json(
      { error: 'Failed to initiate GitHub authentication' },
      { status: 500 }
    );
  }
} 