"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  fetchJiraCreatedIssues,
  fetchJiraCompletedIssues
} from "@/lib/atlassian";
import { CheckCircle, AlertCircle, Clock, Trello } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FilterControls, FilterOptions } from "@/components/filter-controls";
import { PaginationControls } from "@/components/pagination-controls";
import { DateRange } from "react-day-picker";

export function JiraIssuesView() {
  const auth = useAuth();
  
  // Safely access auth context properties
  const isJiraAuthenticated = auth?.isJiraAuthenticated || false;
  const jiraEmail = auth?.jiraEmail || null;
  const jiraApiToken = auth?.jiraApiToken || null;
  const jiraDomain = auth?.jiraDomain || null;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createdIssues, setCreatedIssues] = useState<any[]>([]);
  const [completedIssues, setCompletedIssues] = useState<any[]>([]);
  
  // Pagination state
  const [createdCurrentPage, setCreatedCurrentPage] = useState(1);
  const [createdTotalPages, setCreatedTotalPages] = useState(1);
  const [createdTotalItems, setCreatedTotalItems] = useState(0);
  
  const [completedCurrentPage, setCompletedCurrentPage] = useState(1);
  const [completedTotalPages, setCompletedTotalPages] = useState(1);
  const [completedTotalItems, setCompletedTotalItems] = useState(0);
  
  // Filter state
  const [createdFilters, setCreatedFilters] = useState<FilterOptions>({});
  const [completedFilters, setCompletedFilters] = useState<FilterOptions>({});
  
  // Track if filters have been applied
  const [createdFiltersApplied, setCreatedFiltersApplied] = useState(false);
  const [completedFiltersApplied, setCompletedFiltersApplied] = useState(false);
  
  const PAGE_SIZE = 10;

  // Initial data fetch - removed to not show items until filters are applied
  useEffect(() => {
    if (!isJiraAuthenticated || !jiraEmail || !jiraApiToken || !jiraDomain) {
      setInitialLoading(false);
      return;
    }
    
    // Just set loading to false, don't fetch any data initially
    setInitialLoading(false);
  }, [isJiraAuthenticated, jiraEmail, jiraApiToken, jiraDomain]);

  // Handle created issues search
  const handleCreatedSearch = async (filters: FilterOptions) => {
    if (!isJiraAuthenticated || !jiraEmail || !jiraApiToken || !jiraDomain) return;
    
    setLoading(true);
    setError(null);
    setCreatedFilters(filters);
    setCreatedCurrentPage(1); // Reset to first page on new search
    setCreatedFiltersApplied(true); // Mark that filters have been applied
    
    try {
      const createdData = await fetchJiraCreatedIssues(
        jiraEmail, 
        jiraDomain,
        filters.dateRange?.from as Date | undefined,
        filters.dateRange?.to as Date | undefined,
        1,
        PAGE_SIZE,
        jiraApiToken
      );
      
      setCreatedIssues(createdData.issues || []);
      setCreatedTotalItems(createdData.total || 0);
      setCreatedTotalPages(Math.ceil((createdData.total || 0) / PAGE_SIZE));
    } catch (err) {
      console.error("Error searching Jira created issues:", err);
      setError("Failed to search Jira issues. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle completed issues search
  const handleCompletedSearch = async (filters: FilterOptions) => {
    if (!isJiraAuthenticated || !jiraEmail || !jiraApiToken || !jiraDomain) return;
    
    setLoading(true);
    setError(null);
    setCompletedFilters(filters);
    setCompletedCurrentPage(1); // Reset to first page on new search
    setCompletedFiltersApplied(true); // Mark that filters have been applied
    
    try {
      const completedData = await fetchJiraCompletedIssues(
        jiraEmail, 
        jiraDomain,
        filters.dateRange?.from as Date | undefined,
        filters.dateRange?.to as Date | undefined,
        1,
        PAGE_SIZE,
        jiraApiToken
      );
      
      setCompletedIssues(completedData.issues || []);
      setCompletedTotalItems(completedData.total || 0);
      setCompletedTotalPages(Math.ceil((completedData.total || 0) / PAGE_SIZE));
    } catch (err) {
      console.error("Error searching Jira completed issues:", err);
      setError("Failed to search Jira issues. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle created issues page change
  const handleCreatedPageChange = async (page: number) => {
    if (!isJiraAuthenticated || !jiraEmail || !jiraApiToken || !jiraDomain) return;
    
    setLoading(true);
    setError(null);
    setCreatedCurrentPage(page);
    
    try {
      const createdData = await fetchJiraCreatedIssues(
        jiraEmail, 
        jiraDomain,
        createdFilters.dateRange?.from as Date | undefined,
        createdFilters.dateRange?.to as Date | undefined,
        page,
        PAGE_SIZE,
        jiraApiToken
      );
      
      setCreatedIssues(createdData.issues || []);
    } catch (err) {
      console.error("Error fetching Jira created issues page:", err);
      setError("Failed to fetch issues page. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle completed issues page change
  const handleCompletedPageChange = async (page: number) => {
    if (!isJiraAuthenticated || !jiraEmail || !jiraApiToken || !jiraDomain) return;
    
    setLoading(true);
    setError(null);
    setCompletedCurrentPage(page);
    
    try {
      const completedData = await fetchJiraCompletedIssues(
        jiraEmail, 
        jiraDomain,
        completedFilters.dateRange?.from as Date | undefined,
        completedFilters.dateRange?.to as Date | undefined,
        page,
        PAGE_SIZE,
        jiraApiToken
      );
      
      setCompletedIssues(completedData.issues || []);
    } catch (err) {
      console.error("Error fetching Jira completed issues page:", err);
      setError("Failed to fetch issues page. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isJiraAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Jira Integration</CardTitle>
          <CardDescription>Connect your Jira account to see your issues and projects</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Trello className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Please connect your Atlassian account in the Connections page to view your Jira issues and projects.</p>
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
    return <JiraLoadingSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="mr-2 h-5 w-5" />
            Error Loading Jira Data
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
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="w-full max-w-xs mx-auto mb-6">
          <TabsTrigger value="created" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Created</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Completed</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="created" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Issues I Created</CardTitle>
              <CardDescription>
                Issues you've created in Jira
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FilterControls 
                onSearch={handleCreatedSearch} 
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
              
              {!loading && !createdFiltersApplied && (
                <p className="text-center text-muted-foreground py-8">
                  Select a date range and click "Apply Filter" to see issues.
                </p>
              )}
              
              {!loading && createdFiltersApplied && createdIssues.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No issues found matching your criteria.
                </p>
              )}
              
              {!loading && createdFiltersApplied && createdIssues.length > 0 && (
                <>
                  <div className="space-y-4">
                    {createdIssues.map((issue) => (
                      <IssueCard key={issue.id} issue={issue} domain={jiraDomain!} />
                    ))}
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground text-center">
                    Showing {createdIssues.length} of {createdTotalItems} issues
                  </div>
                  
                  <PaginationControls
                    currentPage={createdCurrentPage}
                    totalPages={createdTotalPages}
                    onPageChange={handleCreatedPageChange}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Completed Issues</CardTitle>
              <CardDescription>
                Issues you've completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FilterControls 
                onSearch={handleCompletedSearch} 
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
              
              {!loading && !completedFiltersApplied && (
                <p className="text-center text-muted-foreground py-8">
                  Select a date range and click "Apply Filter" to see issues.
                </p>
              )}
              
              {!loading && completedFiltersApplied && completedIssues.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No issues found matching your criteria.
                </p>
              )}
              
              {!loading && completedFiltersApplied && completedIssues.length > 0 && (
                <>
                  <div className="space-y-4">
                    {completedIssues.map((issue) => (
                      <IssueCard key={issue.id} issue={issue} domain={jiraDomain!} />
                    ))}
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground text-center">
                    Showing {completedIssues.length} of {completedTotalItems} issues
                  </div>
                  
                  <PaginationControls
                    currentPage={completedCurrentPage}
                    totalPages={completedTotalPages}
                    onPageChange={handleCompletedPageChange}
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

function IssueCard({ issue, domain }: { issue: any, domain: string }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex flex-col space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">
              <a 
                href={`https://${domain}/browse/${issue.key}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline text-primary-600"
              >
                {issue.key}: {issue.fields.summary}
              </a>
            </h3>
            <div className="flex items-center mt-1 space-x-2 text-sm text-muted-foreground">
              <span>Updated: {new Date(issue.fields.updated).toLocaleDateString()}</span>
              {issue.fields.assignee && (
                <>
                  <span>•</span>
                  <span>Assignee: {issue.fields.assignee.displayName}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Badge variant={getStatusVariant(issue.fields.status.name)}>
            {issue.fields.status.name}
          </Badge>
          <Badge variant="outline">{issue.fields.issuetype.name}</Badge>
          {issue.fields.priority && (
            <Badge variant="outline">{issue.fields.priority.name}</Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

function JiraLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      
      <div className="space-y-4">
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
    </div>
  );
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const lowerStatus = status.toLowerCase();
  
  if (lowerStatus.includes("done") || lowerStatus.includes("complete") || lowerStatus.includes("resolved")) {
    return "default";
  }
  
  if (lowerStatus.includes("progress") || lowerStatus.includes("review")) {
    return "secondary";
  }
  
  if (lowerStatus.includes("block") || lowerStatus.includes("reject") || lowerStatus.includes("fail")) {
    return "destructive";
  }
  
  return "outline";
} 