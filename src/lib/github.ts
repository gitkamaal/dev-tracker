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

// Fetch user repositories (both owned and accessible)
export async function fetchUserRepositories(accessToken: string) {
  try {
    const octokit = new Octokit({ auth: accessToken });
    
    // Get repositories the user owns
    const { data: ownedRepos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 50,
      affiliation: "owner,collaborator,organization_member" // Include repos user has access to
    });
    
    return ownedRepos;
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    throw error;
  }
}

// Fetch repositories starred by the user
export async function fetchUserStarredRepos(accessToken: string) {
  try {
    const octokit = new Octokit({ auth: accessToken });
    const { data } = await octokit.rest.activity.listReposStarredByAuthenticatedUser({
      sort: "updated",
      per_page: 20
    });
    return data;
  } catch (error) {
    console.error("Error fetching starred repositories:", error);
    throw error;
  }
}

// Fetch user's pull requests
export async function fetchUserPullRequests(accessToken: string) {
  try {
    const octokit = new Octokit({ auth: accessToken });
    
    // First get the authenticated user to get the username
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const username = user.login;
    
    // Search for pull requests created by the user
    const { data: pullRequestsData } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${username} type:pr`,
      sort: "updated",
      order: "desc",
      per_page: 20
    });
    
    // Fetch additional details for each PR
    const pullRequests = await Promise.all(
      pullRequestsData.items.map(async (pr) => {
        // Extract owner, repo, and PR number from the URL
        const urlParts = pr.pull_request.url.split('/');
        const prNumber = parseInt(urlParts[urlParts.length - 1]);
        const repo = urlParts[urlParts.length - 3];
        const owner = urlParts[urlParts.length - 4];
        
        try {
          const { data: prDetails } = await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number: prNumber
          });
          
          return {
            ...pr,
            merged_at: prDetails.merged_at,
            repository: {
              full_name: `${owner}/${repo}`
            }
          };
        } catch (error) {
          console.error(`Error fetching details for PR #${prNumber}:`, error);
          return {
            ...pr,
            repository: {
              full_name: `${owner}/${repo}`
            }
          };
        }
      })
    );
    
    return pullRequests;
  } catch (error) {
    console.error("Error fetching pull requests:", error);
    throw error;
  }
}

// Fetch user contributions (repositories user has contributed to)
export async function fetchUserContributions(accessToken: string) {
  try {
    const octokit = new Octokit({ auth: accessToken });
    
    // First get the authenticated user to get the username
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const username = user.login;
    
    // Get repositories the user has contributed to but doesn't own
    const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
      username,
      per_page: 100
    });
    
    // Extract unique repositories from events
    const contributedRepoSet = new Set();
    const contributedRepos = [];
    
    for (const event of events) {
      if (event.repo && event.actor.login === username) {
        const repoFullName = event.repo.name;
        
        // Skip if we've already processed this repo
        if (contributedRepoSet.has(repoFullName)) continue;
        
        // Skip if the repo is owned by the user
        if (repoFullName.startsWith(`${username}/`)) continue;
        
        contributedRepoSet.add(repoFullName);
        
        // Get repo details
        try {
          const [owner, repo] = repoFullName.split('/');
          const { data: repoData } = await octokit.rest.repos.get({
            owner,
            repo
          });
          
          contributedRepos.push(repoData);
          
          // Limit to 10 repos to avoid rate limiting
          if (contributedRepos.length >= 10) break;
        } catch (error) {
          console.error(`Error fetching details for repo ${repoFullName}:`, error);
        }
      }
    }
    
    return contributedRepos;
  } catch (error) {
    console.error("Error fetching contributions:", error);
    throw error;
  }
} 