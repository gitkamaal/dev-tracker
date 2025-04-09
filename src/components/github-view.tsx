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
import { DateRange } from "react-day-picker";

export function GitHubView() {
  const auth = useAuth();
  
  // Safely access auth context properties
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
      // If no access token, just set loading to false
      if (!accessToken) {
        setInitialLoading(false);
        return;
      }
      
      // Only validate on initial mount, not on every hot reload
      const shouldValidate = !prFiltersApplied && !commitFiltersApplied;
      
      // If we have a token but it might be stale, validate it first
      if (shouldValidate) {
        try {
          console.log("Validating GitHub token on component mount...");
          // Simple token validation check
          const isValid = !!accessToken;
          
          if (!isValid) {
            console.error("GitHub token validation failed on component mount");
            setError("Your GitHub authentication appears to be invalid. Try reconnecting in the Connections page.");
          }
        } catch (err) {
          console.error("Error validating GitHub token:", err);
        }
      }
      
      // Set loading to false regardless of validation result
      setInitialLoading(false);
    };
    
    initializeAuth();
  }, [accessToken, prFiltersApplied, commitFiltersApplied]);

  // Handle pull requests search
  const handlePrSearch = async (filters: FilterOptions) => {
    console.log("GitHub PR search triggered with filters:", filters);
    
    // Simple token validation check
    const isValid = !!accessToken;
    if (!isValid) {
      setError("Your GitHub authentication appears to be invalid. Try reconnecting in the Connections page.");
      return;
    }
    
    if (!accessToken) return;
    
    setLoading(true);
    setError(null);
    setPrFilters(filters);
    setPrCurrentPage(1); // Reset to first page on new search
    
    try {
      // Extract start and end dates from filters
      let startDate: Date | undefined = undefined;
      let endDate: Date | undefined = undefined;
      
      if (filters.dateRange) {
        const range = filters.dateRange as DateRange;
        if (range.from) {
          startDate = range.from;
        }
        if (range.to) {
          endDate = range.to;
        }
      }
      
      console.log("Fetching pull requests with dates:", { startDate, endDate });
      const result = await fetchUserPullRequests(
        accessToken,
        startDate,
        endDate,
        1, // Start at page 1
        100 // Get up to 100 results
      );
      
      // Calculate pagination
      setPullRequests(result.items.slice(0, PAGE_SIZE));
      setPrTotalItems(result.total_count);
      setPrTotalPages(Math.max(1, Math.ceil(result.total_count / PAGE_SIZE)));
      setPrFiltersApplied(true);
    } catch (err) {
      console.error("Error fetching pull requests:", err);
      setError("Failed to fetch pull requests. Please try again.");
      setPullRequests([]);
      setPrTotalItems(0);
      setPrTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle commits search
  const handleCommitSearch = async (filters: FilterOptions) => {
    console.log("GitHub commit search triggered with filters:", filters);
    
    // Simple token validation check
    const isValid = !!accessToken;
    if (!isValid) {
      setError("Your GitHub authentication appears to be invalid. Try reconnecting in the Connections page.");
      return;
    }
    
    if (!accessToken) return;
    
    setLoading(true);
    setError(null);
    setCommitFilters(filters);
    setCommitCurrentPage(1); // Reset to first page on new search
    
    try {
      // Extract start and end dates from filters
      let startDate: Date | undefined = undefined;
      let endDate: Date | undefined = undefined;
      
      if (filters.dateRange) {
        const range = filters.dateRange as DateRange;
        if (range.from) {
          startDate = range.from;
        }
        if (range.to) {
          endDate = range.to;
        }
      }
      
      console.log("Fetching commits with dates:", { startDate, endDate });
      const result = await fetchUserCommits(
        accessToken,
        startDate,
        endDate,
        1, // Start at page 1
        100 // Get up to 100 results
      );
      
      // Calculate pagination
      setCommits(result.items.slice(0, PAGE_SIZE));
      setCommitTotalItems(result.total_count);
      setCommitTotalPages(Math.max(1, Math.ceil(result.total_count / PAGE_SIZE)));
      setCommitFiltersApplied(true);
    } catch (err) {
      console.error("Error fetching commits:", err);
      setError("Failed to fetch commits. Please try again.");
      setCommits([]);
      setCommitTotalItems(0);
      setCommitTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle pull requests page change
  const handlePrPageChange = async (page: number) => {
    // Simple token validation check
    const isValid = !!accessToken;
    if (!isValid) {
      setError("Your GitHub authentication appears to be invalid. Try reconnecting in the Connections page.");
      return;
    }
    
    if (!accessToken) return;
    
    setLoading(true);
    setPrCurrentPage(page);
    
    try {
      // Extract start and end dates from filters
      let startDate: Date | undefined = undefined;
      let endDate: Date | undefined = undefined;
      
      if (prFilters.dateRange) {
        const range = prFilters.dateRange as DateRange;
        if (range.from) {
          startDate = range.from;
        }
        if (range.to) {
          endDate = range.to;
        }
      }
      
      console.log("Fetching pull requests for page:", page);
      const result = await fetchUserPullRequests(
        accessToken,
        startDate,
        endDate,
        page,
        PAGE_SIZE
      );
      
      setPullRequests(result.items);
      setPrTotalItems(result.total_count);
      setPrTotalPages(Math.max(1, Math.ceil(result.total_count / PAGE_SIZE)));
    } catch (err) {
      console.error("Error fetching pull requests:", err);
      setError("Failed to fetch pull requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle commits page change
  const handleCommitPageChange = async (page: number) => {
    // Simple token validation check
    const isValid = !!accessToken;
    if (!isValid) {
      setError("Your GitHub authentication appears to be invalid. Try reconnecting in the Connections page.");
      return;
    }
    
    if (!accessToken) return;
    
    setLoading(true);
    setCommitCurrentPage(page);
    
    try {
      // Extract start and end dates from filters
      let startDate: Date | undefined = undefined;
      let endDate: Date | undefined = undefined;
      
      if (commitFilters.dateRange) {
        const range = commitFilters.dateRange as DateRange;
        if (range.from) {
          startDate = range.from;
        }
        if (range.to) {
          endDate = range.to;
        }
      }
      
      console.log("Fetching commits for page:", page);
      const result = await fetchUserCommits(
        accessToken,
        startDate,
        endDate,
        page,
        PAGE_SIZE
      );
      
      setCommits(result.items);
      setCommitTotalItems(result.total_count);
      setCommitTotalPages(Math.max(1, Math.ceil(result.total_count / PAGE_SIZE)));
    } catch (err) {
      console.error("Error fetching commits:", err);
      setError("Failed to fetch commits. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Show error if any */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-4">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {/* Show connection prompt if no token */}
      {!accessToken && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-3 mb-4">
                <Github className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">Connect to GitHub</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Connect your GitHub account to view and track your pull requests and commits.
              </p>
              <Link href="/connections">
                <Button>Connect GitHub Account</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Show content if token exists */}
      {accessToken && (
        <Tabs defaultValue="pull-requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pull-requests" className="flex items-center gap-2">
              <GitPullRequest className="h-4 w-4" />
              <span>Pull Requests</span>
            </TabsTrigger>
            <TabsTrigger value="commits" className="flex items-center gap-2">
              <GitCommit className="h-4 w-4" />
              <span>Commits</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Pull Requests Tab */}
          <TabsContent value="pull-requests">
            <Card>
              <CardHeader>
                <CardTitle>Pull Requests</CardTitle>
                <CardDescription>
                  View and track your pull requests across repositories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filter controls */}
                <div className="mb-6">
                  <FilterControls 
                    onSearch={handlePrSearch} 
                    isLoading={loading}
                    showProjectFilter={true}
                  />
                </div>
                
                {/* Loading skeleton */}
                {loading && <GitHubLoadingSkeleton />}
                
                {/* No filters applied yet message */}
                {!loading && !prFiltersApplied && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-md flex items-start">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Apply filters to view your pull requests</p>
                      <p className="text-sm">Use the filters above to search for specific pull requests.</p>
                    </div>
                  </div>
                )}
                
                {/* No PRs found message */}
                {!loading && prFiltersApplied && pullRequests.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No pull requests found matching your criteria.
                  </p>
                )}
                
                {/* PRs list */}
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
          
          {/* Commits Tab */}
          <TabsContent value="commits">
            <Card>
              <CardHeader>
                <CardTitle>Commits</CardTitle>
                <CardDescription>
                  View and track your commits across repositories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filter controls */}
                <div className="mb-6">
                  <FilterControls 
                    onSearch={handleCommitSearch} 
                    isLoading={loading}
                    showProjectFilter={true}
                  />
                </div>
                
                {/* Loading skeleton */}
                {loading && <GitHubLoadingSkeleton />}
                
                {/* No filters applied yet message */}
                {!loading && !commitFiltersApplied && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-md flex items-start">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Apply filters to view your commits</p>
                      <p className="text-sm">Use the filters above to search for specific commits.</p>
                    </div>
                  </div>
                )}
                
                {/* No commits found message */}
                {!loading && commitFiltersApplied && commits.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No commits found matching your criteria.
                  </p>
                )}
                
                {/* Commits list */}
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
      )}
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