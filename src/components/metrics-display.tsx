"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitCommit, GitPullRequest, GitMerge, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export function MetricsDisplay() {
  const { isAuthenticated, accessToken, user } = useAuth();
  const [metrics, setMetrics] = useState({
    commits: 0,
    pullRequests: 0,
    reviews: 0,
    issues: 0,
    streak: 0,
    repositories: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGitHubMetrics = async () => {
      if (!isAuthenticated || !accessToken || !user) {
        return;
      }

      setLoading(true);
      try {
        // Fetch user's events to calculate metrics
        const eventsResponse = await fetch(`https://api.github.com/users/${user.login}/events?per_page=100`, {
          headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch GitHub events');
        }

        const events = await eventsResponse.json();
        
        // Fetch user's repositories
        const reposResponse = await fetch(`https://api.github.com/user/repos?per_page=100`, {
          headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (!reposResponse.ok) {
          throw new Error('Failed to fetch GitHub repositories');
        }

        const repos = await reposResponse.json();

        // Calculate metrics
        let commitCount = 0;
        let prCount = 0;
        let reviewCount = 0;
        let issueCount = 0;
        
        // Process events to count different activities
        events.forEach((event: any) => {
          switch (event.type) {
            case 'PushEvent':
              commitCount += event.payload.commits?.length || 0;
              break;
            case 'PullRequestEvent':
              if (event.payload.action === 'opened' || event.payload.action === 'reopened') {
                prCount++;
              }
              break;
            case 'PullRequestReviewEvent':
            case 'PullRequestReviewCommentEvent':
              reviewCount++;
              break;
            case 'IssuesEvent':
              if (event.payload.action === 'opened' || event.payload.action === 'reopened') {
                issueCount++;
              }
              break;
          }
        });

        // Calculate streak (simplified version)
        const dates = events
          .filter((event: any) => event.type === 'PushEvent')
          .map((event: any) => new Date(event.created_at).toISOString().split('T')[0]);
        
        const uniqueDates = [...new Set(dates)].sort();
        let streak = 0;
        
        if (uniqueDates.length > 0) {
          let currentStreak = 1;
          for (let i = 1; i < uniqueDates.length; i++) {
            const prevDate = new Date(uniqueDates[i-1]);
            const currDate = new Date(uniqueDates[i]);
            const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              currentStreak++;
            } else {
              currentStreak = 1;
            }
            
            streak = Math.max(streak, currentStreak);
          }
        }

        setMetrics({
          commits: commitCount,
          pullRequests: prCount,
          reviews: reviewCount,
          issues: issueCount,
          streak: streak,
          repositories: repos.length
        });
      } catch (error) {
        console.error('Error fetching GitHub metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubMetrics();
  }, [isAuthenticated, accessToken, user]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Development Metrics</CardTitle>
        <CardDescription>Your GitHub activity metrics</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            Loading metrics...
          </div>
        ) : !isAuthenticated ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            Connect your GitHub account to see your metrics
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex flex-col items-center">
              <GitCommit className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-2xl font-bold">{metrics.commits}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Commits</span>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg flex flex-col items-center">
              <GitPullRequest className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-2xl font-bold">{metrics.pullRequests}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Pull Requests</span>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex flex-col items-center">
              <MessageSquare className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-2xl font-bold">{metrics.reviews}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Reviews</span>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg flex flex-col items-center">
              <GitMerge className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-2xl font-bold">{metrics.issues}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Issues</span>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex flex-col items-center">
              <svg className="h-8 w-8 text-red-500 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-2xl font-bold">{metrics.repositories}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Repositories</span>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg flex flex-col items-center">
              <svg className="h-8 w-8 text-indigo-500 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-2xl font-bold">{metrics.streak}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Day Streak</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 