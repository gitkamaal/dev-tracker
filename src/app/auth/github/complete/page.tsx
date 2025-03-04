"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GitHubAuthComplete() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get the access token from the URL
    const accessToken = searchParams.get('access_token');
    
    if (accessToken) {
      // Store the token in localStorage
      localStorage.setItem('github_access_token', accessToken);
      
      // Redirect to the connections page
      router.push('/connections');
    } else {
      // If no token, redirect to error page
      router.push('/auth/error');
    }
  }, [searchParams, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing GitHub Authentication</h1>
        <p className="text-muted-foreground">Please wait while we complete your authentication...</p>
      </div>
    </div>
  );
} 