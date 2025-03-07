"use client";

import { redirect } from 'next/navigation';

// Base Atlassian API URL
const ATLASSIAN_API_URL = 'https://api.atlassian.com';

// Helper function to create Bearer Auth header for PAT
export function createBearerAuthHeader(token: string): string {
  return `Bearer ${token}`;
}

// Helper function to create Basic Auth header for email and API token
export function createBasicAuthHeader(email: string, apiToken: string): string {
  const credentials = `${email}:${apiToken}`;
  const encodedCredentials = btoa(credentials);
  return `Basic ${encodedCredentials}`;
}

// Error handling helper
function handleApiError(response: Response, service: string): never {
  if (response.status === 401) {
    throw new Error(`Invalid credentials for ${service} API. Please check your email and API token.`);
  } else if (response.status === 403) {
    throw new Error(`Insufficient permissions to access ${service} API.`);
  } else {
    throw new Error(`${service} API error: ${response.status} ${response.statusText}`);
  }
}

// Ensure domain has proper format
function formatDomain(domain: string): string {
  // Remove any protocol if present
  let formattedDomain = domain.replace(/^https?:\/\//, '');
  
  // Remove trailing slashes
  formattedDomain = formattedDomain.replace(/\/+$/, '');
  
  console.log(`Formatted domain: ${formattedDomain}`);
  return formattedDomain;
}

// Helper function to make API requests through our proxy
async function makeProxyRequest(url: string, email: string, apiToken: string, method: string = 'GET', body?: any) {
  console.log(`Making proxy request to: ${url}`);
  
  try {
    const response = await fetch('/api/atlassian', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        email,
        apiToken,
        method,
        body
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Proxy request failed:', errorData);
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Proxy request error:', error);
    throw error;
  }
}

// Helper function to make API requests through our proxy with token auth
async function makeProxyRequestWithToken(url: string, token: string, method: string = 'GET', body?: any) {
  console.log(`Making proxy request with token to: ${url}`);
  
  try {
    const response = await fetch('/api/atlassian', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        token,
        method,
        body,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Proxy request failed:", error);
    throw error;
  }
}

/**
 * Atlassian API utilities for Jira, Confluence, and Bitbucket
 */

// ===== JIRA API FUNCTIONS =====

/**
 * Fetch the user's Jira profile
 */
export async function fetchJiraProfile(email: string, apiToken: string, domain: string) {
  console.log(`Fetching Jira profile with domain: ${domain}`);
  const formattedDomain = formatDomain(domain);
  
  // Use the standard Atlassian Cloud format with Basic Auth
  const url = `https://${formattedDomain}/rest/api/2/myself`;
  console.log(`Jira profile URL: ${url}`);
  
  try {
    return await makeProxyRequest(url, email, apiToken);
  } catch (error) {
    console.error("Error in fetchJiraProfile:", error);
    throw error;
  }
}

/**
 * Fetch Jira projects the user has access to
 */
export async function fetchJiraProjects(email: string, apiToken: string, domain: string) {
  const formattedDomain = formatDomain(domain);
  const url = `https://${formattedDomain}/rest/api/2/project/search`;
  
  try {
    return await makeProxyRequest(url, email, apiToken);
  } catch (error) {
    console.error("Error in fetchJiraProjects:", error);
    throw error;
  }
}

/**
 * Fetch issues assigned to the user
 */
export async function fetchJiraAssignedIssues(email: string, apiToken: string, domain: string) {
  const formattedDomain = formatDomain(domain);
  const jql = encodeURIComponent("assignee = currentUser() ORDER BY updated DESC");
  const url = `https://${formattedDomain}/rest/api/2/search?jql=${jql}&maxResults=20`;
  
  try {
    return await makeProxyRequest(url, email, apiToken);
  } catch (error) {
    console.error("Error in fetchJiraAssignedIssues:", error);
    throw error;
  }
}

/**
 * Fetch issues created by the user with optional date filtering (token-based auth)
 */
export async function fetchJiraCreatedIssues(
  tokenOrEmail: string, 
  domain: string,
  startDate?: Date,
  endDate?: Date,
  page: number = 1,
  pageSize: number = 10,
  apiToken?: string
) {
  const formattedDomain = formatDomain(domain);
  
  // Build JQL query with date filtering if provided
  let jql = "reporter = currentUser()";
  
  // Add date range if provided
  if (startDate) {
    const startDateStr = startDate.toISOString().split('T')[0];
    jql += ` AND created >= "${startDateStr}"`;
  }
  
  if (endDate) {
    const endDateStr = endDate.toISOString().split('T')[0];
    jql += ` AND created <= "${endDateStr}"`;
  }
  
  // Add sorting and pagination
  jql += " ORDER BY created DESC";
  const startAt = (page - 1) * pageSize;
  
  const url = `https://${formattedDomain}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=${pageSize}&startAt=${startAt}`;
  
  try {
    // If apiToken is provided, use email/apiToken auth, otherwise use token auth
    if (apiToken) {
      return await makeProxyRequest(url, tokenOrEmail, apiToken);
    } else {
      return await makeProxyRequestWithToken(url, tokenOrEmail);
    }
  } catch (error) {
    console.error("Error in fetchJiraCreatedIssues:", error);
    throw error;
  }
}

/**
 * Fetch issues completed by the user with optional date filtering (token-based auth)
 */
export async function fetchJiraCompletedIssues(
  tokenOrEmail: string, 
  domain: string,
  startDate?: Date,
  endDate?: Date,
  page: number = 1,
  pageSize: number = 10,
  apiToken?: string
) {
  const formattedDomain = formatDomain(domain);
  
  // Build JQL query with date filtering if provided
  let jql = "assignee = currentUser() AND status in (Done, Closed, Resolved)";
  
  // Add date range if provided
  if (startDate) {
    const startDateStr = startDate.toISOString().split('T')[0];
    jql += ` AND resolutiondate >= "${startDateStr}"`;
  }
  
  if (endDate) {
    const endDateStr = endDate.toISOString().split('T')[0];
    jql += ` AND resolutiondate <= "${endDateStr}"`;
  }
  
  // Add sorting and pagination
  jql += " ORDER BY updated DESC";
  const startAt = (page - 1) * pageSize;
  
  const url = `https://${formattedDomain}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=${pageSize}&startAt=${startAt}`;
  
  try {
    // If apiToken is provided, use email/apiToken auth, otherwise use token auth
    if (apiToken) {
      return await makeProxyRequest(url, tokenOrEmail, apiToken);
    } else {
      return await makeProxyRequestWithToken(url, tokenOrEmail);
    }
  } catch (error) {
    console.error("Error in fetchJiraCompletedIssues:", error);
    throw error;
  }
}

/**
 * Fetch recent activity in Jira
 */
export async function fetchJiraRecentActivity(email: string, apiToken: string, domain: string) {
  const formattedDomain = formatDomain(domain);
  
  try {
    // Get issues updated in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateString = sevenDaysAgo.toISOString().split('T')[0];
    
    const jql = encodeURIComponent(`updated >= ${dateString} AND (assignee = currentUser() OR reporter = currentUser()) ORDER BY updated DESC`);
    const url = `https://${formattedDomain}/rest/api/2/search?jql=${jql}&maxResults=20`;
    
    return await makeProxyRequest(url, email, apiToken);
  } catch (error) {
    console.error("Error in fetchJiraRecentActivity:", error);
    throw error;
  }
}

// ===== CONFLUENCE API FUNCTIONS =====

/**
 * Fetch Confluence spaces the user has access to
 */
export async function fetchConfluenceSpaces(email: string, apiToken: string, domain: string) {
  const formattedDomain = formatDomain(domain);
  const url = `https://${formattedDomain}/wiki/rest/api/space?limit=20`;
  
  try {
    return await makeProxyRequest(url, email, apiToken);
  } catch (error) {
    console.error("Error fetching Confluence spaces:", error);
    throw error;
  }
}

/**
 * Fetch Confluence pages created by the user
 */
export async function fetchConfluencePages(email: string, apiToken: string, domain: string) {
  const formattedDomain = formatDomain(domain);
  
  try {
    // First get the user's account ID from Jira profile
    const userProfile = await fetchJiraProfile(email, apiToken, domain);
    const accountId = userProfile.accountId;
    
    if (!accountId) {
      throw new Error("Could not determine user account ID");
    }
    
    const url = `https://${formattedDomain}/wiki/rest/api/content?creator=${accountId}&limit=20&expand=space,version`;
    
    return await makeProxyRequest(url, email, apiToken);
  } catch (error) {
    console.error("Error fetching Confluence pages:", error);
    throw error;
  }
}

// ===== BITBUCKET API FUNCTIONS =====

/**
 * Fetch Bitbucket repositories the user has access to
 */
export async function fetchBitbucketRepositories(email: string, apiToken: string, domain: string) {
  try {
    // For Bitbucket Cloud
    const url = `https://api.bitbucket.org/2.0/repositories?role=member`;
    
    return await makeProxyRequest(url, email, apiToken);
  } catch (error) {
    console.error("Error fetching Bitbucket repositories:", error);
    throw error;
  }
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
    reporter: issue.fields.reporter?.displayName || 'Unknown',
    url: `https://${issue.self.split('/rest/')[0].split('://')[1]}/browse/${issue.key}`,
  };
}

/**
 * Formats a Confluence page for display
 */
export function formatConfluencePage(page: any): any {
  return {
    id: page.id,
    title: page.title,
    type: page.type,
    space: page.space?.name || 'Unknown Space',
    spaceKey: page.space?.key || '',
    created: new Date(page.history.createdDate).toLocaleDateString(),
    updated: new Date(page.history.lastUpdated.when).toLocaleDateString(),
    creator: page.history.createdBy.displayName || 'Unknown',
    url: page._links?.webui || '',
  };
}

/**
 * Fetches the user's accessible Atlassian resources
 */
export async function fetchAccessibleResources(accessToken: string): Promise<any[]> {
  try {
    const response = await fetch(`${ATLASSIAN_API_URL}/oauth/token/accessible-resources`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      handleApiError(response, 'accessible resources');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching Atlassian accessible resources:', error);
    throw error;
  }
}

/**
 * Fetches Bitbucket commits by the user
 */
export async function fetchBitbucketCommits(accessToken: string, workspaceId: string, repoSlug: string, accountId: string): Promise<any[]> {
  try {
    const response = await fetch(
      `${ATLASSIAN_API_URL}/ex/bitbucket/${workspaceId}/2.0/repositories/${repoSlug}/commits?include=${accountId}&pagelen=50`, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      handleApiError(response, 'Bitbucket commits');
    }

    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Error fetching Bitbucket commits:', error);
    throw error;
  }
}

/**
 * Fetches Bitbucket pull requests created by the user
 */
export async function fetchBitbucketPullRequests(accessToken: string, workspaceId: string, accountId: string): Promise<any[]> {
  try {
    const response = await fetch(
      `${ATLASSIAN_API_URL}/ex/bitbucket/${workspaceId}/2.0/pullrequests/${accountId}?pagelen=50`, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      handleApiError(response, 'Bitbucket pull requests');
    }

    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Error fetching Bitbucket pull requests:', error);
    throw error;
  }
}

/**
 * Formats a Bitbucket repository for display
 */
export function formatBitbucketRepo(repo: any): any {
  return {
    name: repo.name,
    slug: repo.slug,
    description: repo.description || '',
    created: new Date(repo.created_on).toLocaleDateString(),
    updated: new Date(repo.updated_on).toLocaleDateString(),
    language: repo.language || 'Unknown',
    size: repo.size || 0,
    url: repo.links?.html?.href || '',
  };
} 