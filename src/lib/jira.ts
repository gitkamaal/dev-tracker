import { redirect } from 'next/navigation';

// Jira API integration with Personal Access Tokens

const JIRA_API_URL = 'https://api.atlassian.com';

/**
 * Validates a Jira PAT by fetching the user's profile
 */
export async function fetchUserProfile(accessToken: string): Promise<any> {
  try {
    const response = await fetch(`${JIRA_API_URL}/myself`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid or expired Atlassian token. Please generate a new token.');
      } else if (response.status === 403) {
        throw new Error('Insufficient permissions. Your token may not have the required scopes.');
      } else {
        throw new Error(`Failed to fetch Jira user profile: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching Jira user profile:', error);
    throw error;
  }
}

/**
 * Fetches the user's accessible Jira sites
 */
export async function fetchAccessibleResources(accessToken: string): Promise<any[]> {
  try {
    const response = await fetch(`${JIRA_API_URL}/oauth/token/accessible-resources`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch accessible Jira resources');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching Jira accessible resources:', error);
    throw error;
  }
}

/**
 * Fetches issues assigned to the user
 */
export async function fetchAssignedIssues(accessToken: string, cloudId: string): Promise<any[]> {
  try {
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
  } catch (error) {
    console.error('Error fetching Jira issues:', error);
    throw error;
  }
}

/**
 * Fetches recent activity for the user
 */
export async function fetchRecentActivity(accessToken: string, cloudId: string): Promise<any[]> {
  try {
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
  } catch (error) {
    console.error('Error fetching recent Jira activity:', error);
    throw error;
  }
}

/**
 * Fetches projects the user has access to
 */
export async function fetchProjects(accessToken: string, cloudId: string): Promise<any[]> {
  try {
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
  } catch (error) {
    console.error('Error fetching Jira projects:', error);
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
    url: issue.fields.assignee?.self ? issue.fields.assignee.self.split('/rest/')[0] + '/browse/' + issue.key : '',
  };
} 