import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/jira';

// This route handles the Jira OAuth callback
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
    const redirectUrl = new URL('/auth/jira/complete', request.nextUrl.origin);
    redirectUrl.searchParams.set('access_token', tokenData.access_token);
    redirectUrl.searchParams.set('refresh_token', tokenData.refresh_token);
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in Jira callback:', error);
    return NextResponse.redirect(new URL('/auth/error', request.nextUrl.origin));
  }
} 