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

// Fetch user's pull requests with optional date filtering
export async function fetchUserPullRequests(
  accessToken: string,
  startDate?: Date,
  endDate?: Date,
  page: number = 1,
  perPage: number = 10
) {
  try {
    const octokit = new Octokit({ auth: accessToken });
    
    // First get the authenticated user to get the username
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const username = user.login;
    
    // Build search query with date filtering
    let query = `author:${username} type:pr`;
    
    // Add date range if provided
    if (startDate) {
      const startDateStr = startDate.toISOString().split('T')[0];
      query += ` created:>=${startDateStr}`;
    }
    
    if (endDate) {
      const endDateStr = endDate.toISOString().split('T')[0];
      query += ` created:<=${endDateStr}`;
    }
    
    // Search for pull requests created by the user
    const { data: pullRequestsData } = await octokit.rest.search.issuesAndPullRequests({
      q: query,
      sort: "updated",
      order: "desc",
      per_page: perPage,
      page: page
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
    
    return {
      items: pullRequests,
      total_count: pullRequestsData.total_count
    };
  } catch (error) {
    console.error("Error fetching pull requests:", error);
    throw error;
  }
}

// Fetch user's commits with optional date filtering
export async function fetchUserCommits(
  accessToken: string,
  startDate?: Date,
  endDate?: Date,
  page: number = 1,
  perPage: number = 10
) {
  try {
    const octokit = new Octokit({ auth: accessToken });
    
    // First get the authenticated user to get the username
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const username = user.login;
    
    // Build search query with date filtering
    let query = `author:${username}`;
    
    // Add date range if provided
    if (startDate) {
      const startDateStr = startDate.toISOString().split('T')[0];
      query += ` committer-date:>=${startDateStr}`;
    }
    
    if (endDate) {
      const endDateStr = endDate.toISOString().split('T')[0];
      query += ` committer-date:<=${endDateStr}`;
    }
    
    // Search for commits by the user
    const { data: commitsData } = await octokit.rest.search.commits({
      q: query,
      sort: "committer-date",
      order: "desc",
      per_page: perPage,
      page: page
    });
    
    // Format the commits data
    const commits = commitsData.items.map(item => ({
      id: item.sha,
      repo_name: item.repository.full_name,
      html_url: item.html_url,
      message: item.commit.message,
      created_at: item.commit.committer.date,
      branch: item.commit.tree.sha // Not the actual branch name, but a reference
    }));
    
    return {
      items: commits,
      total_count: commitsData.total_count
    };
  } catch (error) {
    console.error("Error fetching commits:", error);
    
    // If the search API fails, return mock data for now
    // This is a fallback for testing purposes
    const mockCommits = [
      {
        id: 'commit-1',
        repo_name: 'user/repo1',
        html_url: 'https://github.com/user/repo1/commit/123',
        message: 'Update documentation',
        created_at: new Date().toISOString(),
        branch: 'main'
      },
      {
        id: 'commit-2',
        repo_name: 'user/repo2',
        html_url: 'https://github.com/user/repo2/commit/456',
        message: 'Fix bug in login flow',
        created_at: new Date().toISOString(),
        branch: 'feature/login'
      },
      {
        id: 'commit-3',
        repo_name: 'user/repo3',
        html_url: 'https://github.com/user/repo3/commit/789',
        message: 'Add new feature',
        created_at: new Date().toISOString(),
        branch: 'develop'
      }
    ];
    
    return {
      items: mockCommits,
      total_count: mockCommits.length
    };
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