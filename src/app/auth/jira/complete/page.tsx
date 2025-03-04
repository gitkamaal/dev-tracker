"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function JiraAuthComplete() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get the access token and refresh token from the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      // Store the tokens in localStorage
      localStorage.setItem('jira_access_token', accessToken);
      localStorage.setItem('jira_refresh_token', refreshToken);
      
      // Redirect to the connections page
      router.push('/connections');
    } else {
      // If no tokens, redirect to error page
      router.push('/auth/error');
    }
  }, [searchParams, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing Jira Authentication</h1>
        <p className="text-muted-foreground">Please wait while we complete your authentication...</p>
      </div>
    </div>
  );
} 