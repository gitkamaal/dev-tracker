import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/github';

// This route handles the GitHub OAuth callback
export async function GET(request: NextRequest) {
  try {
    // Get the authorization code from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    // Validate the request
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is missing' },
        { status: 400 }
      );
    }
    
    // Exchange the code for an access token
    const tokenData = await exchangeCodeForToken(code);
    
    // Redirect to a page that will store the token in localStorage
    // We use a special page for this since we can't directly modify localStorage from an API route
    const redirectUrl = new URL('/auth/github/complete', request.nextUrl.origin);
    redirectUrl.searchParams.set('access_token', tokenData.access_token);
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in GitHub callback:', error);
    return NextResponse.redirect(new URL('/auth/error', request.nextUrl.origin));
  }
} 