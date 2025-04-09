"use client";

import { redirect } from 'next/navigation';

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

/**
 * Jira API utilities using JQL format
 */

/**
 * Builds a JQL query string based on provided parameters
 * @param status Optional status filter (e.g., "Done", "In Progress")
 * @param projectKey Optional Jira project key
 * @param teamName Optional team name (usually custom field)
 * @param assigneeEmail Optional assignee email
 * @param startDate Optional start date for filtering
 * @param endDate Optional end date for filtering
 * @param additionalCriteria Optional additional JQL criteria
 * @returns Formatted JQL query string
 */
export function buildJqlQuery({
  status,
  projectKey,
  teamName,
  assigneeEmail,
  startDate,
  endDate,
  additionalCriteria
}: {
  status?: string | string[],
  projectKey?: string,
  teamName?: string,
  assigneeEmail?: string,
  startDate?: Date,
  endDate?: Date,
  additionalCriteria?: string
}): string {
  const conditions: string[] = [];
  
  // Add status condition if provided
  if (status) {
    if (Array.isArray(status)) {
      if (status.length === 1) {
        conditions.push(`status = "${status[0]}"`);
      } else if (status.length > 1) {
        conditions.push(`status IN (${status.map(s => `"${s}"`).join(', ')})`);
      }
    } else {
      conditions.push(`status = "${status}"`);
    }
  }
  
  // Add project condition if provided
  if (projectKey) {
    conditions.push(`project = "${projectKey}"`);
  }
  
  // Add team condition if provided (assuming it's a custom field)
  if (teamName) {
    conditions.push(`team = "${teamName}"`);
  }
  
  // Add assignee condition if provided
  if (assigneeEmail) {
    conditions.push(`assignee = "${assigneeEmail}"`);
  }
  
  // Add date range conditions if provided
  if (startDate) {
    const formattedStartDate = startDate.toISOString().split('T')[0];
    conditions.push(`updated >= "${formattedStartDate}"`);
  }
  
  if (endDate) {
    const formattedEndDate = endDate.toISOString().split('T')[0];
    conditions.push(`updated <= "${formattedEndDate}"`);
  }
  
  // Add any additional criteria
  if (additionalCriteria) {
    conditions.push(additionalCriteria);
  }
  
  // Join all conditions with AND
  return conditions.length > 0 ? conditions.join(' AND ') : '';
}

/**
 * Fetch the user's Jira profile
 */
export async function fetchJiraProfile(email: string, apiToken: string, domain: string) {
  console.log(`Fetching Jira profile with domain: ${domain}`);
  const formattedDomain = formatDomain(domain);
  
  try {
    const url = `https://${formattedDomain}/rest/api/3/myself`;
    return await makeProxyRequest(url, email, apiToken);
  } catch (error) {
    console.error("Error fetching Jira profile:", error);
    throw error;
  }
}

/**
 * Fetch Jira issues using JQL
 * @param email User email for authentication
 * @param apiToken API token for authentication
 * @param domain Jira domain
 * @param jqlQuery JQL query string
 * @param startAt Pagination start index
 * @param maxResults Maximum results to return
 */
export async function fetchJiraIssuesByJql(
  email: string,
  apiToken: string,
  domain: string,
  jqlQuery: string,
  startAt: number = 0,
  maxResults: number = 10
) {
  console.log(`Fetching Jira issues with JQL: ${jqlQuery}`);
  const formattedDomain = formatDomain(domain);
  
  try {
    // Encode the JQL query for URL
    const encodedJql = encodeURIComponent(jqlQuery);
    
    // Construct the URL with JQL query
    const url = `https://${formattedDomain}/rest/api/3/search?jql=${encodedJql}&startAt=${startAt}&maxResults=${maxResults}`;
    
    console.log(`Making request to: ${url}`);
    
    const response = await makeProxyRequest(url, email, apiToken);
    return response;
  } catch (error) {
    console.error("Error fetching Jira issues by JQL:", error);
    throw error;
  }
}

/**
 * Fetch Jira projects the user has access to
 */
export async function fetchJiraProjects(email: string, apiToken: string, domain: string) {
  console.log(`Fetching Jira projects with domain: ${domain}`);
  const formattedDomain = formatDomain(domain);
  
  try {
    const url = `https://${formattedDomain}/rest/api/3/project`;
    return await makeProxyRequest(url, email, apiToken);
  } catch (error) {
    console.error("Error fetching Jira projects:", error);
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