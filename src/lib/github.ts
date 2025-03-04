import { redirect } from 'next/navigation';

// GitHub OAuth configuration from environment variables
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

// Use a function to get the current origin for the redirect URI
const getRedirectUri = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/auth/callback/github`;
  }
  return process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || `${APP_URL}/api/auth/callback/github`;
};

// GitHub API endpoints
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_API_URL = 'https://api.github.com';

/**
 * Generate the GitHub authorization URL
 * @returns The URL to redirect the user to for GitHub authorization
 */
export function getGitHubAuthUrl() {
  if (!GITHUB_CLIENT_ID) {
    console.error('GitHub Client ID is not configured');
    return '#';
  }

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: getRedirectUri(),
    scope: 'repo user',
    state: generateRandomState(),
  });

  return `${GITHUB_AUTH_URL}?${params.toString()}`;
}

/**
 * Generate a random state string for CSRF protection
 */
function generateRandomState() {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Exchange the authorization code for an access token
 * @param code The authorization code from GitHub
 * @returns The access token and other response data
 */
export async function exchangeCodeForToken(code: string) {
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error('GitHub OAuth credentials are not configured');
  }

  const response = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: getRedirectUri(),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  return response.json();
}

/**
 * Fetch the authenticated user's profile
 * @param accessToken The GitHub access token
 * @returns The user's profile data
 */
export async function fetchUserProfile(accessToken: string) {
  const response = await fetch(`${GITHUB_API_URL}/user`, {
    headers: {
      'Authorization': `token ${accessToken}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
}

/**
 * Fetch the user's repositories
 * @param accessToken The GitHub access token
 * @returns The user's repositories
 */
export async function fetchUserRepositories(accessToken: string) {
  const response = await fetch(`${GITHUB_API_URL}/user/repos?sort=updated&per_page=10`, {
    headers: {
      'Authorization': `token ${accessToken}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user repositories');
  }

  return response.json();
}

/**
 * Fetch the user's contributions (commit count)
 * @param accessToken The GitHub access token
 * @param username The GitHub username
 * @returns The user's contribution data
 */
export async function fetchUserContributions(accessToken: string, username: string) {
  // This is a simplified approach - GitHub doesn't have a direct API for contribution counts
  // In a real app, you might need to use GraphQL API or aggregate data from multiple endpoints
  const since = new Date();
  since.setMonth(since.getMonth() - 1);
  
  const response = await fetch(
    `${GITHUB_API_URL}/search/commits?q=author:${username}+committer-date:>${since.toISOString().split('T')[0]}`,
    {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.cloak-preview+json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch user contributions');
  }

  return response.json();
} 