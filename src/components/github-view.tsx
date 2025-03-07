"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUserPullRequests } from "@/lib/github";
import { Github, GitPullRequest, GitFork, AlertCircle, GitCommit, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MetricsDisplay } from "@/components/metrics-display";

export function GitHubView() {
  const auth = useAuth();
  
  // Safely access auth context properties
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user || null;
  const accessToken = auth?.accessToken || null;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pullRequests, setPullRequests] = useState<any[]>([]);
  const [commits, setCommits] = useState<any[]>([]);

  useEffect(() => {
    const fetchGitHubData = async () => {
      if (!isAuthenticated || !accessToken) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch pull requests
        const prsData = await fetchUserPullRequests(accessToken);
        setPullRequests(prsData || []);
        
        // For commits, we'll use a simplified approach for now
        // In a real implementation, you'd fetch actual commit data
        // This is just to show something in the UI
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
        
        setCommits(mockCommits);
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        setError("Failed to fetch GitHub data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGitHubData();
  }, [isAuthenticated, accessToken]);

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Integration</CardTitle>
          <CardDescription>Connect your GitHub account to see your repositories and activity</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Github className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Please connect your GitHub account in the Connections page to view your repositories and activity.</p>
            <Button asChild variant="outline">
              <Link href="/connections">
                Go to Connections
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return <GitHubLoadingSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="mr-2 h-5 w-5" />
            Error Loading GitHub Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="pullrequests" className="w-full">
        <TabsList className="w-full max-w-sm mx-auto mb-6">
          <TabsTrigger value="pullrequests" className="flex items-center gap-2">
            <GitPullRequest className="h-4 w-4" />
            <span>Pull Requests</span>
          </TabsTrigger>
          <TabsTrigger value="commits" className="flex items-center gap-2">
            <GitCommit className="h-4 w-4" />
            <span>Commits</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Metrics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pullrequests" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Pull Requests</CardTitle>
              <CardDescription>
                Your open and recently closed pull requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pullRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pull requests found.
                </p>
              ) : (
                <div className="space-y-4">
                  {pullRequests.map((pr) => (
                    <PullRequestCard key={pr.id} pr={pr} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="commits" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Recent Commits</CardTitle>
              <CardDescription>
                Your recent commits across repositories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {commits.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No recent commits found.
                </p>
              ) : (
                <div className="space-y-4">
                  {commits.map((commit) => (
                    <CommitCard key={commit.id} commit={commit} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-0">
          <MetricsDisplay />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PullRequestCard({ pr }: { pr: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">
              <a 
                href={pr.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline text-primary-600"
              >
                {pr.title}
              </a>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {pr.repository?.full_name || pr.repository_url?.split('/').slice(-2).join('/')} • #{pr.number}
            </p>
          </div>
          <Badge variant={pr.state === "open" ? "default" : "secondary"}>
            {pr.state}
          </Badge>
        </div>
        <div className="mt-3 text-sm">
          <span>Created: {new Date(pr.created_at).toLocaleDateString()}</span>
          {pr.merged_at && (
            <span className="ml-2">Merged: {new Date(pr.merged_at).toLocaleDateString()}</span>
          )}
          {pr.closed_at && !pr.merged_at && (
            <span className="ml-2">Closed: {new Date(pr.closed_at).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </Card>
  );
}

function CommitCard({ commit }: { commit: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start">
          <GitCommit className="h-5 w-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="font-medium">
              <a 
                href={commit.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline text-primary-600"
              >
                {commit.message || `Commit to ${commit.repo_name}`}
              </a>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {commit.repo_name} • {commit.branch || 'main'} branch
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(commit.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function GitHubLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-5 w-full max-w-md mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}