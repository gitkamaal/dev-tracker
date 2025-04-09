"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitCommit, GitPullRequest, GitMerge, MessageSquare, Calendar } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type Activity = {
  id: string;
  type: 'commit' | 'pr' | 'review' | 'issue';
  title: string;
  repo: string;
  date: Date;
  url?: string;
}

export function ActivityTimeline({ source = "all" }: { source?: "all" | "github" }) {
  const { accessToken } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchGitHubActivities = async () => {
      if (!accessToken) {
        // Use empty activities if not authenticated
        setActivities([]);
        return;
      }

      setLoading(true);
      try {
        // Fetch recent events from GitHub
        const response = await fetch(`https://api.github.com/user/events?per_page=20`, {
          headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch GitHub activities');
        }

        const events = await response.json();
        
        // Transform GitHub events to our activity format
        const transformedActivities = events.map((event: any) => {
          let activity: Activity = {
            id: event.id,
            type: 'commit',
            title: 'Unknown activity',
            repo: event.repo.name,
            date: new Date(event.created_at),
            url: event.payload.comment?.html_url || event.payload.pull_request?.html_url || event.payload.issue?.html_url || `https://github.com/${event.repo.name}`
          };

          switch (event.type) {
            case 'PushEvent':
              const commitCount = event.payload.commits?.length || 0;
              activity.type = 'commit';
              activity.title = commitCount === 1 
                ? `Pushed 1 commit to ${event.repo.name}`
                : `Pushed ${commitCount} commits to ${event.repo.name}`;
              break;
            case 'PullRequestEvent':
              activity.type = 'pr';
              activity.title = `${event.payload.action} pull request in ${event.repo.name}`;
              break;
            case 'IssueCommentEvent':
              activity.type = 'review';
              activity.title = `Commented on issue in ${event.repo.name}`;
              break;
            case 'IssuesEvent':
              activity.type = 'issue';
              activity.title = `${event.payload.action} issue in ${event.repo.name}`;
              break;
            case 'PullRequestReviewEvent':
              activity.type = 'review';
              activity.title = `Reviewed pull request in ${event.repo.name}`;
              break;
            case 'PullRequestReviewCommentEvent':
              activity.type = 'review';
              activity.title = `Commented on pull request in ${event.repo.name}`;
              break;
            case 'CreateEvent':
              activity.type = 'commit';
              activity.title = `Created ${event.payload.ref_type} ${event.payload.ref || ''} in ${event.repo.name}`;
              break;
            case 'DeleteEvent':
              activity.type = 'commit';
              activity.title = `Deleted ${event.payload.ref_type} ${event.payload.ref || ''} in ${event.repo.name}`;
              break;
            case 'ForkEvent':
              activity.type = 'pr';
              activity.title = `Forked ${event.repo.name}`;
              break;
            case 'WatchEvent':
              activity.type = 'issue';
              activity.title = `Starred ${event.repo.name}`;
              break;
            default:
              activity.type = 'commit';
              activity.title = `Activity in ${event.repo.name}`;
          }

          return activity;
        });

        setActivities(transformedActivities);
      } catch (error) {
        console.error('Error fetching GitHub activities:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubActivities();
  }, [accessToken]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'commit':
        return <GitCommit className="h-5 w-5 text-blue-500" />;
      case 'pr':
        return <GitPullRequest className="h-5 w-5 text-purple-500" />;
      case 'review':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'issue':
        return <GitMerge className="h-5 w-5 text-orange-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{source === "github" ? "GitHub Activity" : "Recent Activity"}</CardTitle>
        <CardDescription>
          {source === "github" 
            ? "Your contributions and activity on GitHub" 
            : "Your latest development activities"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <select
            className="text-sm border rounded p-1 dark:bg-gray-800 dark:border-gray-700"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Activities</option>
            <option value="commit">Commits</option>
            <option value="pr">Pull Requests</option>
            <option value="review">Reviews</option>
            <option value="issue">Issues</option>
          </select>
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            Loading activities...
          </div>
        ) : !accessToken ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            Connect your GitHub account to see your activities
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No activities found for the selected filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <a 
                    href={activity.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline"
                  >
                    {activity.title}
                  </a>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(activity.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 