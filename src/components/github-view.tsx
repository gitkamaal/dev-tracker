"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUserPullRequests, fetchUserCommits } from "@/lib/github";
import { Github, GitPullRequest, GitFork, AlertCircle, GitCommit, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FilterControls, FilterOptions } from "@/components/filter-controls";
import { PaginationControls } from "@/components/pagination-controls";

export function GitHubView() {
  const auth = useAuth();
  
  // Safely access auth context properties
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user || null;
  const accessToken = auth?.accessToken || null;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pullRequests, setPullRequests] = useState<any[]>([]);
  const [commits, setCommits] = useState<any[]>([]);
  
  // Pagination state
  const [prCurrentPage, setPrCurrentPage] = useState(1);
  const [prTotalPages, setPrTotalPages] = useState(1);
  const [prTotalItems, setPrTotalItems] = useState(0);
  
  const [commitCurrentPage, setCommitCurrentPage] = useState(1);
  const [commitTotalPages, setCommitTotalPages] = useState(1);
  const [commitTotalItems, setCommitTotalItems] = useState(0);
  
  // Filter state
  const [prFilters, setPrFilters] = useState<FilterOptions>({});
  const [commitFilters, setCommitFilters] = useState<FilterOptions>({});
  
  // Track if filters have been applied
  const [prFiltersApplied, setPrFiltersApplied] = useState(false);
  const [commitFiltersApplied, setCommitFiltersApplied] = useState(false);
  
  const PAGE_SIZE = 10;

  // Initial data fetch - removed to not show items until filters are applied
  useEffect(() => {
    const initializeAuth = async () => {
      // If not authenticated or no access token, just set loading to false
      if (!isAuthenticated || !accessToken) {
        setInitialLoading(false);
        return;
      }
      
      // Only validate on initial mount, not on every hot reload
      const shouldValidate = !prFiltersApplied && !commitFiltersApplied;
      
      // If we have a token but it might be stale, validate it first
      if (shouldValidate && auth?.validateGitHubToken) {
        try {
          console.log("Validating GitHub token on component mount...");
          const isValid = await auth.validateGitHubToken();
          
          if (!isValid) {
            console.error("GitHub token validation failed on component mount");
            setError("Your GitHub authentication appears to be invalid. Try disconnecting and reconnecting in the Connections page.");
          }
        } catch (err) {
          console.error("Error validating GitHub token:", err);
        }
      }
      
      // Set loading to false regardless of validation result
      setInitialLoading(false);
    };
    
    initializeAuth();
  }, [isAuthenticated, accessToken, auth, prFiltersApplied, commitFiltersApplied]);

  // Handle pull requests search
  const handlePrSearch = async (filters: FilterOptions) => {
    console.log("GitHub PR search triggered with filters:", filters);
    
    // First validate the token
    if (auth?.validateGitHubToken) {
      const isValid = await auth.validateGitHubToken();
      if (!isValid) {
        setError("Your GitHub authentication appears to be invalid. Try disconnecting and reconnecting in the Connections page.");
        return;
      }
    }
    
    if (!isAuthenticated || !accessToken) return;
    
    setLoading(true);
    setError(null);
    setPrFilters(filters);
    setPrCurrentPage(1); // Reset to first page on new search
    setPrFiltersApplied(true); // Mark that filters have been applied
    
    try {
      console.log("Fetching PRs with:", { accessToken, from: filters.dateRange?.from, to: filters.dateRange?.to });
      const prsData = await fetchUserPullRequests(
        accessToken,
        filters.dateRange?.from,
        filters.dateRange?.to,
        1,
        PAGE_SIZE
      );
      
      console.log("PR data received:", prsData);
      setPullRequests(prsData.items || []);
      setPrTotalItems(prsData.total_count || 0);
      setPrTotalPages(Math.ceil((prsData.total_count || 0) / PAGE_SIZE));
    } catch (err) {
      console.error("Error searching GitHub pull requests:", err);
      setError("Failed to search pull requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle commits search
  const handleCommitSearch = async (filters: FilterOptions) => {
    console.log("GitHub commit search triggered with filters:", filters);
    
    // First validate the token
    if (auth?.validateGitHubToken) {
      const isValid = await auth.validateGitHubToken();
      if (!isValid) {
        setError("Your GitHub authentication appears to be invalid. Try disconnecting and reconnecting in the Connections page.");
        return;
      }
    }
    
    if (!isAuthenticated || !accessToken) return;
    
    setLoading(true);
    setError(null);
    setCommitFilters(filters);
    setCommitCurrentPage(1); // Reset to first page on new search
    setCommitFiltersApplied(true); // Mark that filters have been applied
    
    try {
      console.log("Fetching commits with:", { accessToken, from: filters.dateRange?.from, to: filters.dateRange?.to });
      const commitsData = await fetchUserCommits(
        accessToken,
        filters.dateRange?.from,
        filters.dateRange?.to,
        1,
        PAGE_SIZE
      );
      
      console.log("Commit data received:", commitsData);
      setCommits(commitsData.items || []);
      setCommitTotalItems(commitsData.total_count || 0);
      setCommitTotalPages(Math.ceil((commitsData.total_count || 0) / PAGE_SIZE));
    } catch (err) {
      console.error("Error searching GitHub commits:", err);
      setError("Failed to search commits. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle pull requests page change
  const handlePrPageChange = async (page: number) => {
    // First validate the token
    if (auth?.validateGitHubToken) {
      const isValid = await auth.validateGitHubToken();
      if (!isValid) {
        setError("Your GitHub authentication appears to be invalid. Try disconnecting and reconnecting in the Connections page.");
        return;
      }
    }

    if (!isAuthenticated || !accessToken) return;
    
    setLoading(true);
    setError(null);
    setPrCurrentPage(page);
    
    try {
      const prsData = await fetchUserPullRequests(
        accessToken,
        prFilters.dateRange?.from,
        prFilters.dateRange?.to,
        page,
        PAGE_SIZE
      );
      
      setPullRequests(prsData.items || []);
    } catch (err) {
      console.error("Error fetching GitHub pull requests page:", err);
      setError("Failed to fetch pull requests page. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle commits page change
  const handleCommitPageChange = async (page: number) => {
    // First validate the token
    if (auth?.validateGitHubToken) {
      const isValid = await auth.validateGitHubToken();
      if (!isValid) {
        setError("Your GitHub authentication appears to be invalid. Try disconnecting and reconnecting in the Connections page.");
        return;
      }
    }

    if (!isAuthenticated || !accessToken) return;
    
    setLoading(true);
    setError(null);
    setCommitCurrentPage(page);
    
    try {
      const commitsData = await fetchUserCommits(
        accessToken,
        commitFilters.dateRange?.from,
        commitFilters.dateRange?.to,
        page,
        PAGE_SIZE
      );
      
      setCommits(commitsData.items || []);
    } catch (err) {
      console.error("Error fetching GitHub commits page:", err);
      setError("Failed to fetch commits page. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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

  if (initialLoading) {
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
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Authentication Error</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-2">{error}</p>
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/connections">
                      Go to Connections Page
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="pullrequests" className="w-full">
        <TabsList className="w-full max-w-xs mx-auto mb-6">
          <TabsTrigger value="pullrequests" className="flex items-center gap-2">
            <GitPullRequest className="h-4 w-4" />
            <span>Pull Requests</span>
          </TabsTrigger>
          <TabsTrigger value="commits" className="flex items-center gap-2">
            <GitCommit className="h-4 w-4" />
            <span>Commits</span>
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
              <FilterControls 
                onSearch={handlePrSearch} 
                isLoading={loading} 
              />
              
              {loading && (
                <div className="space-y-4 mt-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton className="h-5 w-full max-w-md mb-2" />
                      <Skeleton className="h-4 w-32 mb-4" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!loading && !prFiltersApplied && (
                <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">No data displayed yet</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                        You're connected to GitHub, but you need to use the filter controls above to display your pull requests.
                        <br />
                        Try selecting a date range and clicking "Apply Filters" to see your data.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {!loading && prFiltersApplied && pullRequests.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No pull requests found matching your criteria.
                </p>
              )}
              
              {!loading && prFiltersApplied && pullRequests.length > 0 && (
                <>
                  <div className="space-y-4">
                    {pullRequests.map((pr) => (
                      <PullRequestCard key={pr.id} pr={pr} />
                    ))}
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground text-center">
                    Showing {pullRequests.length} of {prTotalItems} pull requests
                  </div>
                  
                  <PaginationControls
                    currentPage={prCurrentPage}
                    totalPages={prTotalPages}
                    onPageChange={handlePrPageChange}
                  />
                </>
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
              <FilterControls 
                onSearch={handleCommitSearch} 
                isLoading={loading} 
              />
              
              {loading && (
                <div className="space-y-4 mt-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton className="h-5 w-full max-w-md mb-2" />
                      <Skeleton className="h-4 w-32 mb-4" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!loading && !commitFiltersApplied && (
                <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">No data displayed yet</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                        You're connected to GitHub, but you need to use the filter controls above to display your commits.
                        <br />
                        Try selecting a date range and clicking "Apply Filters" to see your data.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {!loading && commitFiltersApplied && commits.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No commits found matching your criteria.
                </p>
              )}
              
              {!loading && commitFiltersApplied && commits.length > 0 && (
                <>
                  <div className="space-y-4">
                    {commits.map((commit) => (
                      <CommitCard key={commit.id} commit={commit} />
                    ))}
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground text-center">
                    Showing {commits.length} of {commitTotalItems} commits
                  </div>
                  
                  <PaginationControls
                    currentPage={commitCurrentPage}
                    totalPages={commitTotalPages}
                    onPageChange={handleCommitPageChange}
                  />
                </>
              )}
            </CardContent>
          </Card>
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