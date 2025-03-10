"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBitbucketWorkspaces, fetchBitbucketPullRequests, fetchBitbucketCommits } from "@/lib/atlassian";
import { GitPullRequest, GitCommit, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FilterControls, FilterOptions } from "@/components/filter-controls";
import { PaginationControls } from "@/components/pagination-controls";

export function BitbucketView() {
  const auth = useAuth();
  
  // Safely access auth context properties
  const isAuthenticated = auth?.isBitbucketAuthenticated || false;
  const bitbucketToken = auth?.bitbucketToken || null;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
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

  // Initial data fetch - load workspaces
  useEffect(() => {
    const initializeAuth = async () => {
      // If not authenticated, just set loading to false
      if (!isAuthenticated || !bitbucketToken) {
        setInitialLoading(false);
        return;
      }
      
      // Only validate on initial mount
      if (auth?.validateBitbucketCredentials) {
        try {
          console.log("Validating Bitbucket credentials on component mount...");
          const isValid = await auth.validateBitbucketCredentials();
          
          if (!isValid) {
            console.error("Bitbucket credentials validation failed on component mount");
            setError("Your Bitbucket authentication appears to be invalid. Try disconnecting and reconnecting in the Connections page.");
            setInitialLoading(false);
            return;
          }
          
          console.log("Bitbucket credentials validation successful");
        } catch (err) {
          console.error("Error validating Bitbucket credentials:", err);
          setError(`Error validating Bitbucket credentials: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setInitialLoading(false);
          return;
        }
      }
      
      try {
        console.log("Loading Bitbucket workspaces on component mount...");
        const workspacesData = await fetchBitbucketWorkspaces(bitbucketToken);
        
        console.log("Workspaces data received:", workspacesData);
        
        if (workspacesData && workspacesData.values) {
          setWorkspaces(workspacesData.values);
          if (workspacesData.values.length > 0) {
            setSelectedWorkspace(workspacesData.values[0].slug);
          }
        } else {
          setError("No Bitbucket workspaces found. Make sure your app password has the correct permissions.");
        }
      } catch (err) {
        console.error("Error loading Bitbucket workspaces:", err);
        setError(`Failed to load Bitbucket workspaces: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
      
      // Set loading to false regardless of result
      setInitialLoading(false);
    };
    
    initializeAuth();
  }, [isAuthenticated, bitbucketToken, auth]);

  // Handle pull requests search
  const handlePrSearch = async (filters: FilterOptions) => {
    console.log("Bitbucket PR search triggered with filters:", filters);
    
    // First validate the token
    if (auth?.validateBitbucketCredentials) {
      const isValid = await auth.validateBitbucketCredentials();
      if (!isValid) {
        setError("Your Bitbucket authentication appears to be invalid. Try disconnecting and reconnecting in the Connections page.");
        return;
      }
    }
    
    if (!isAuthenticated || !bitbucketToken || !selectedWorkspace) {
      setError("Please select a workspace first.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setPrFilters(filters);
    setPrCurrentPage(1); // Reset to first page on new search
    setPrFiltersApplied(true); // Mark that filters have been applied
    
    try {
      console.log("Fetching PRs with:", { 
        token: "***", 
        workspace: selectedWorkspace,
        from: filters.dateRange?.from, 
        to: filters.dateRange?.to 
      });
      
      const prsData = await fetchBitbucketPullRequests(
        bitbucketToken,
        selectedWorkspace,
        "", // All repositories
        "OPEN", // Default state
        filters.dateRange?.from,
        filters.dateRange?.to,
        1,
        PAGE_SIZE
      );
      
      console.log("PR data received:", prsData);
      setPullRequests(prsData.values || []);
      setPrTotalItems(prsData.size || 0);
      setPrTotalPages(Math.ceil((prsData.size || 0) / PAGE_SIZE));
    } catch (err) {
      console.error("Error searching Bitbucket pull requests:", err);
      setError("Failed to search pull requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle commits search
  const handleCommitSearch = async (filters: FilterOptions) => {
    console.log("Bitbucket commit search triggered with filters:", filters);
    
    // First validate the token
    if (auth?.validateBitbucketCredentials) {
      const isValid = await auth.validateBitbucketCredentials();
      if (!isValid) {
        setError("Your Bitbucket authentication appears to be invalid. Try disconnecting and reconnecting in the Connections page.");
        return;
      }
    }
    
    if (!isAuthenticated || !bitbucketToken || !selectedWorkspace) {
      setError("Please select a workspace first.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setCommitFilters(filters);
    setCommitCurrentPage(1); // Reset to first page on new search
    setCommitFiltersApplied(true); // Mark that filters have been applied
    
    try {
      console.log("Fetching commits with:", { 
        token: "***", 
        workspace: selectedWorkspace,
        from: filters.dateRange?.from, 
        to: filters.dateRange?.to 
      });
      
      // Note: For commits, we need a specific repository
      // For simplicity, we'll just show a message to select a repository
      // In a real implementation, you'd add a repository selector
      setCommits([]);
      setCommitTotalItems(0);
      setCommitTotalPages(1);
      setError("To view commits, please select a specific repository. This feature will be implemented soon.");
      
    } catch (err) {
      console.error("Error searching Bitbucket commits:", err);
      setError("Failed to search commits. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle pull requests page change
  const handlePrPageChange = async (page: number) => {
    // First validate the token
    if (auth?.validateBitbucketCredentials) {
      const isValid = await auth.validateBitbucketCredentials();
      if (!isValid) {
        setError("Your Bitbucket authentication appears to be invalid. Try disconnecting and reconnecting in the Connections page.");
        return;
      }
    }

    if (!isAuthenticated || !bitbucketToken || !selectedWorkspace) return;
    
    setLoading(true);
    setError(null);
    setPrCurrentPage(page);
    
    try {
      const prsData = await fetchBitbucketPullRequests(
        bitbucketToken,
        selectedWorkspace,
        "", // All repositories
        "OPEN", // Default state
        prFilters.dateRange?.from,
        prFilters.dateRange?.to,
        page,
        PAGE_SIZE
      );
      
      setPullRequests(prsData.values || []);
    } catch (err) {
      console.error("Error fetching Bitbucket pull requests page:", err);
      setError("Failed to fetch pull requests page. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle workspace change
  const handleWorkspaceChange = (workspace: string) => {
    setSelectedWorkspace(workspace);
    // Reset filters and data
    setPrFiltersApplied(false);
    setCommitFiltersApplied(false);
    setPullRequests([]);
    setCommits([]);
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bitbucket Integration</CardTitle>
          <CardDescription>Connect your Bitbucket account to see your Bitbucket repositories and activity</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
              <path d="M5.8 11.3 2 4.5h20l-3.8 6.8a1 1 0 0 1-.9.5h-10a1 1 0 0 1-.9-.5z" />
              <path d="M10 19.5 8 22" />
              <path d="m14 19.5 2 2.5" />
              <path d="M5.2 11.3 6.6 19h10.8l1.4-7.7" />
            </svg>
            <p className="text-muted-foreground">Please connect your Bitbucket account in the Connections page to view your Bitbucket repositories and activity.</p>
            <Button asChild variant="outline">
              <Link href="/connections">Go to Connections</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (initialLoading) {
    return <BitbucketLoadingSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Bitbucket Activity</span>
          {workspaces.length > 0 && (
            <select 
              className="text-sm border rounded p-1"
              value={selectedWorkspace}
              onChange={(e) => handleWorkspaceChange(e.target.value)}
            >
              {workspaces.map((workspace) => (
                <option key={workspace.slug} value={workspace.slug}>
                  {workspace.name}
                </option>
              ))}
            </select>
          )}
        </CardTitle>
        <CardDescription>View your recent Bitbucket pull requests and commits</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="pull-requests">
          <TabsList className="mb-4">
            <TabsTrigger value="pull-requests" className="flex items-center gap-2">
              <GitPullRequest className="h-4 w-4" />
              <span>Pull Requests</span>
            </TabsTrigger>
            <TabsTrigger value="commits" className="flex items-center gap-2">
              <GitCommit className="h-4 w-4" />
              <span>Commits</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pull-requests">
            <div className="space-y-4">
              <FilterControls 
                onSearch={handlePrSearch} 
                loading={loading}
                showDateFilter={true}
                showTextFilter={false}
                showStatusFilter={false}
              />
              
              {!prFiltersApplied && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Use the filters above to search for pull requests.
                    </p>
                  </div>
                </div>
              )}
              
              {prFiltersApplied && (
                <>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-4">
                              <Skeleton className="h-6 w-3/4 mb-2" />
                              <Skeleton className="h-4 w-1/2 mb-4" />
                              <div className="flex gap-2">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <>
                      {pullRequests.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No pull requests found for the selected filters.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {pullRequests.map((pr) => (
                            <PullRequestCard key={pr.id} pr={pr} />
                          ))}
                          
                          <PaginationControls 
                            currentPage={prCurrentPage}
                            totalPages={prTotalPages}
                            totalItems={prTotalItems}
                            onPageChange={handlePrPageChange}
                            loading={loading}
                          />
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="commits">
            <div className="space-y-4">
              <FilterControls 
                onSearch={handleCommitSearch} 
                loading={loading}
                showDateFilter={true}
                showTextFilter={false}
                showStatusFilter={false}
              />
              
              {!commitFiltersApplied && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Use the filters above to search for commits.
                    </p>
                  </div>
                </div>
              )}
              
              {commitFiltersApplied && (
                <>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-4">
                              <Skeleton className="h-6 w-3/4 mb-2" />
                              <Skeleton className="h-4 w-1/2 mb-4" />
                              <div className="flex gap-2">
                                <Skeleton className="h-5 w-16 rounded-full" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <>
                      {commits.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No commits found for the selected filters.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {commits.map((commit) => (
                            <CommitCard key={commit.hash} commit={commit} />
                          ))}
                          
                          <PaginationControls 
                            currentPage={commitCurrentPage}
                            totalPages={commitTotalPages}
                            totalItems={commitTotalItems}
                            onPageChange={() => {}} // Not implemented yet
                            loading={loading}
                          />
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function PullRequestCard({ pr }: { pr: any }) {
  // Format the date
  const createdDate = new Date(pr.created_on);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <h3 className="font-medium text-base mb-1">
            <a 
              href={pr.links?.html?.href || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {pr.title}
            </a>
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {pr.source?.repository?.name} • Created on {formattedDate}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {pr.state}
            </Badge>
            {pr.author && (
              <Badge variant="secondary" className="text-xs">
                {pr.author.display_name}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CommitCard({ commit }: { commit: any }) {
  // Format the date
  const createdDate = new Date(commit.date);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <h3 className="font-medium text-base mb-1">
            <a 
              href={commit.links?.html?.href || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {commit.message.split('\n')[0]}
            </a>
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {commit.repository?.name} • Committed on {formattedDate}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {commit.hash.substring(0, 7)}
            </Badge>
            {commit.author && (
              <Badge variant="secondary" className="text-xs">
                {commit.author.user?.display_name || commit.author.raw}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BitbucketLoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-6">
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default BitbucketView;
