import { Octokit } from "octokit";

// Validate GitHub token by fetching user profile
export async function fetchUserProfile(accessToken: string) {
  try {
    const octokit = new Octokit({ auth: accessToken });
    const { data } = await octokit.rest.users.getAuthenticated();
    return data;
  } catch (error) {
    console.error("Error fetching GitHub user profile:", error);
    throw error;
  }
}

// Fetch user repositories
export async function fetchUserRepositories(accessToken: string) {
  try {
    const octokit = new Octokit({ auth: accessToken });
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 10,
    });
    return data;
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    throw error;
  }
}

// Fetch user contributions (commits, PRs, issues)
export async function fetchUserContributions(accessToken: string, username: string) {
  try {
    const octokit = new Octokit({ auth: accessToken });
    
    // Get user's events
    const { data: events } = await octokit.rest.activity.listEventsForAuthenticatedUser({
      username,
      per_page: 30,
    });
    
    // Get user's pull requests
    const { data: pullRequests } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${username} type:pr state:all`,
      per_page: 10,
    });
    
    // Get user's issues
    const { data: issues } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${username} type:issue state:all`,
      per_page: 10,
    });
    
    return {
      events,
      pullRequests: pullRequests.items,
      issues: issues.items,
    };
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    throw error;
  }
} 