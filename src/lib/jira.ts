import { redirect } from 'next/navigation';

// Jira OAuth and API integration

// Atlassian/Jira OAuth configuration from environment variables
const JIRA_CLIENT_ID = process.env.NEXT_PUBLIC_JIRA_CLIENT_ID || '';
const JIRA_CLIENT_SECRET = process.env.JIRA_CLIENT_SECRET || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';
const JIRA_SCOPE = 'read:jira-user read:jira-work write:jira-work offline_access';

// Use a function to get the current origin for the redirect URI
const getRedirectUri = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/jira/complete`;
  }
  return process.env.NEXT_PUBLIC_JIRA_REDIRECT_URI || `${APP_URL}/auth/jira/complete`;
};

// Jira API endpoints
const JIRA_AUTH_URL = 'https://auth.atlassian.com/authorize';
const JIRA_TOKEN_URL = 'https://auth.atlassian.com/oauth/token';
const JIRA_API_URL = 'https://api.atlassian.com';

/**
 * Generates the Jira OAuth authorization URL
 */
export function getJiraAuthUrl(): string {
  if (!JIRA_CLIENT_ID) {
    console.error('Jira Client ID is not configured');
    return '#';
  }

  const params = new URLSearchParams({
    audience: 'api.atlassian.com',
    client_id: JIRA_CLIENT_ID,
    scope: JIRA_SCOPE,
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    prompt: 'consent',
  });

  return `${JIRA_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchanges an authorization code for access and refresh tokens
 */
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  if (!JIRA_CLIENT_ID || !JIRA_CLIENT_SECRET) {
    throw new Error('Jira OAuth credentials are not configured');
  }

  const response = await fetch(JIRA_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: JIRA_CLIENT_ID,
      client_secret: JIRA_CLIENT_SECRET,
      code,
      redirect_uri: getRedirectUri(),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  return response.json();
}

/**
 * Refreshes an expired access token using a refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  if (!JIRA_CLIENT_ID || !JIRA_CLIENT_SECRET) {
    throw new Error('Jira OAuth credentials are not configured');
  }

  const response = await fetch(JIRA_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: JIRA_CLIENT_ID,
      client_secret: JIRA_CLIENT_SECRET,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  return response.json();
}

/**
 * Fetches the user's Jira profile
 */
export async function fetchUserProfile(accessToken: string): Promise<any> {
  const response = await fetch(`${JIRA_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Jira user profile');
  }

  return response.json();
}

/**
 * Fetches the user's accessible Jira sites
 */
export async function fetchAccessibleResources(accessToken: string): Promise<any[]> {
  const response = await fetch(`${JIRA_API_URL}/oauth/token/accessible-resources`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch accessible Jira resources');
  }

  return response.json();
}

/**
 * Fetches issues assigned to the user
 */
export async function fetchAssignedIssues(accessToken: string, cloudId: string): Promise<any[]> {
  const jql = encodeURIComponent('assignee = currentUser() ORDER BY updated DESC');
  const response = await fetch(
    `${JIRA_API_URL}/ex/jira/${cloudId}/rest/api/3/search?jql=${jql}`, 
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Jira issues');
  }

  const data = await response.json();
  return data.issues || [];
}

/**
 * Fetches recent activity for the user
 */
export async function fetchRecentActivity(accessToken: string, cloudId: string): Promise<any[]> {
  // This endpoint gets issues updated recently
  const jql = encodeURIComponent('updated >= -7d ORDER BY updated DESC');
  const response = await fetch(
    `${JIRA_API_URL}/ex/jira/${cloudId}/rest/api/3/search?jql=${jql}`, 
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch recent Jira activity');
  }

  const data = await response.json();
  return data.issues || [];
}

/**
 * Fetches projects the user has access to
 */
export async function fetchProjects(accessToken: string, cloudId: string): Promise<any[]> {
  const response = await fetch(
    `${JIRA_API_URL}/ex/jira/${cloudId}/rest/api/3/project`, 
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Jira projects');
  }

  return response.json();
}

/**
 * Formats a Jira issue for display
 */
export function formatJiraIssue(issue: any): any {
  return {
    id: issue.id,
    key: issue.key,
    summary: issue.fields.summary,
    status: issue.fields.status.name,
    priority: issue.fields.priority?.name || 'None',
    issueType: issue.fields.issuetype.name,
    created: new Date(issue.fields.created).toLocaleDateString(),
    updated: new Date(issue.fields.updated).toLocaleDateString(),
    assignee: issue.fields.assignee?.displayName || 'Unassigned',
    url: `https://your-domain.atlassian.net/browse/${issue.key}`,
  };
} 