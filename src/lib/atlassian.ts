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
  
  if (!token) {
    console.error("No token provided for API request");
    throw new Error("Authentication token is required");
  }
  
  try {
    console.log(`Sending request to proxy with token: ${token.substring(0, 5)}...`);
    
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
      const errorText = await response.text();
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        // Try to parse the error as JSON
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error("API error response:", errorData);
      } catch (e) {
        // If not JSON, use the raw text
        console.error("API error response (raw):", errorText);
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("API response received successfully");
    return data;
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
 * Fetch Bitbucket workspaces the user has access to
 */
export async function fetchBitbucketWorkspaces(token: string) {
  try {
    console.log("Fetching Bitbucket workspaces with token");
    const url = `https://api.bitbucket.org/2.0/workspaces`;
    
    // For Bitbucket, we need to use a different authentication method
    // The token is used as an app password with the username 'x-token-auth'
    return await makeProxyRequestWithAppPassword(url, token);
  } catch (error) {
    console.error("Error fetching Bitbucket workspaces:", error);
    throw error;
  }
}

/**
 * Helper function to make API requests through our proxy with Bitbucket app password
 * Bitbucket uses a different authentication method than other Atlassian products
 */
async function makeProxyRequestWithAppPassword(url: string, appPassword: string, method: string = 'GET', body?: any) {
  console.log(`Making Bitbucket request with app password to: ${url}`);
  
  if (!appPassword) {
    console.error("No app password provided for Bitbucket API request");
    throw new Error("Bitbucket app password is required");
  }
  
  try {
    console.log(`Sending request to proxy with app password: ${appPassword.substring(0, 5)}...`);
    
    // For Bitbucket, we use Basic auth with username 'x-token-auth' and the app password as the password
    // This is the recommended approach for Bitbucket Cloud API
    // See: https://developer.atlassian.com/cloud/bitbucket/rest/intro/#authentication
    const response = await fetch('/api/atlassian', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        email: 'x-token-auth', // Special username for Bitbucket app passwords
        apiToken: appPassword, // Use the app password as the API token
        method,
        body,
        isBitbucket: true, // Flag to indicate this is a Bitbucket request
      }),
    });
    
    // Handle response
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      console.error("Error parsing response:", e);
      const text = await response.text();
      throw new Error(`Invalid JSON response: ${text}`);
    }
    
    if (!response.ok) {
      console.error("API error response:", responseData);
      throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
    }
    
    console.log("Bitbucket API response received successfully");
    return responseData;
  } catch (error) {
    console.error("Bitbucket proxy request failed:", error);
    throw error;
  }
}

/**
 * Fetch Bitbucket repositories the user has access to
 */
export async function fetchBitbucketRepositories(
  token: string, 
  workspace: string = '',
  page: number = 1,
  pageSize: number = 10
) {
  try {
    let url = `https://api.bitbucket.org/2.0/repositories`;
    
    if (workspace) {
      url = `https://api.bitbucket.org/2.0/repositories/${workspace}`;
    }
    
    // Add pagination
    url += `?page=${page}&pagelen=${pageSize}`;
    
    return await makeProxyRequestWithAppPassword(url, token);
  } catch (error) {
    console.error("Error fetching Bitbucket repositories:", error);
    throw error;
  }
}

/**
 * Fetch Bitbucket pull requests
 */
export async function fetchBitbucketPullRequests(
  token: string,
  workspace: string,
  repository: string = '',
  state: string = 'OPEN',
  fromDate?: Date,
  toDate?: Date,
  page: number = 1,
  pageSize: number = 10
) {
  try {
    let url;
    
    if (repository) {
      // If repository is specified, get PRs for that specific repo
      url = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repository}/pullrequests`;
    } else {
      // Otherwise, get all PRs for the workspace
      // Note: Bitbucket API doesn't have a direct endpoint for all PRs in a workspace
      // This is a limitation we'll need to handle in the UI
      url = `https://api.bitbucket.org/2.0/pullrequests/${workspace}`;
    }
    
    // Add state filter
    url += `?state=${state}`;
    
    // Add date filters if provided
    if (fromDate) {
      const fromDateStr = fromDate.toISOString().split('T')[0];
      url += `&q=created_on>=${fromDateStr}`;
    }
    
    if (toDate) {
      const toDateStr = toDate.toISOString().split('T')[0];
      url += `${fromDate ? '+AND+' : '&q='}created_on<=${toDateStr}`;
    }
    
    // Add pagination
    url += `&page=${page}&pagelen=${pageSize}`;
    
    return await makeProxyRequestWithAppPassword(url, token);
  } catch (error) {
    console.error("Error fetching Bitbucket pull requests:", error);
    throw error;
  }
}

/**
 * Fetch Bitbucket commits
 */
export async function fetchBitbucketCommits(
  token: string,
  workspace: string,
  repository: string,
  fromDate?: Date,
  toDate?: Date,
  page: number = 1,
  pageSize: number = 10
) {
  try {
    // Bitbucket requires a specific repository for commits
    if (!repository) {
      throw new Error("Repository is required to fetch commits");
    }
    
    let url = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repository}/commits`;
    
    // Add date filters if provided
    if (fromDate) {
      const fromDateStr = fromDate.toISOString().split('T')[0];
      url += `?q=date>=${fromDateStr}`;
    }
    
    if (toDate) {
      const toDateStr = toDate.toISOString().split('T')[0];
      url += `${fromDate ? '+AND+' : '?q='}date<=${toDateStr}`;
    }
    
    // Add pagination
    url += `${(fromDate || toDate) ? '&' : '?'}page=${page}&pagelen=${pageSize}`;
    
    return await makeProxyRequestWithAppPassword(url, token);
  } catch (error) {
    console.error("Error fetching Bitbucket commits:", error);
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
    workspace: repo.workspace?.slug || repo.workspace?.name || '',
    isPrivate: repo.is_private || false,
    mainBranch: repo.mainbranch?.name || 'master',
    owner: repo.owner?.display_name || 'Unknown',
  };
}

/**
 * Formats a Bitbucket pull request for display
 */
export function formatBitbucketPullRequest(pr: any): any {
  return {
    id: pr.id,
    title: pr.title,
    description: pr.description || '',
    state: pr.state,
    created: new Date(pr.created_on).toLocaleDateString(),
    updated: new Date(pr.updated_on).toLocaleDateString(),
    author: pr.author?.display_name || 'Unknown',
    sourceBranch: pr.source?.branch?.name || '',
    destinationBranch: pr.destination?.branch?.name || '',
    url: pr.links?.html?.href || '',
    commentCount: pr.comment_count || 0,
    repository: pr.destination?.repository?.name || '',
    repoSlug: pr.destination?.repository?.slug || '',
    workspace: pr.destination?.repository?.workspace?.slug || '',
  };
}

/**
 * Formats a Bitbucket commit for display
 */
export function formatBitbucketCommit(commit: any): any {
  return {
    hash: commit.hash,
    message: commit.message || '',
    date: new Date(commit.date).toLocaleDateString(),
    author: commit.author?.user?.display_name || commit.author?.raw || 'Unknown',
    url: commit.links?.html?.href || '',
    repository: commit.repository?.name || '',
    repoSlug: commit.repository?.slug || '',
    workspace: commit.repository?.workspace?.slug || '',
  };
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