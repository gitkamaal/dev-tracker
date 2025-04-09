"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJiraIssuesByJql, buildJqlQuery, formatJiraIssue } from "@/lib/atlassian";
import { AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FilterControls, FilterOptions } from "@/components/filter-controls";
import { PaginationControls } from "@/components/pagination-controls";
import { JiraIcon } from "@/components/ui/jira-icon";

export function JiraIssuesView() {
  const auth = useAuth();
  
  // Safely access auth context properties
  const jiraEmail = auth?.jiraEmail || null;
  const jiraApiToken = auth?.jiraApiToken || null;
  const jiraDomain = auth?.jiraDomain || null;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({});
  
  // Track if filters have been applied
  const [filtersApplied, setFiltersApplied] = useState(false);
  
  const PAGE_SIZE = 10;

  // Initialize auth on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      // If no credentials, just set loading to false
      if (!jiraEmail || !jiraApiToken || !jiraDomain) {
        setInitialLoading(false);
        return;
      }
      
      // Only validate on initial mount, not on every hot reload
      if (!filtersApplied) {
        try {
          console.log("Validating Jira credentials on component mount...");
          // Simple credentials validation check
          const isValid = !!jiraEmail && !!jiraApiToken && !!jiraDomain;
          
          if (!isValid) {
            console.error("Jira credentials validation failed on component mount");
            setError("Your Jira authentication appears to be invalid. Try reconnecting in the Connections page.");
          }
        } catch (err) {
          console.error("Error validating Jira credentials:", err);
        }
      }
      
      // Set loading to false regardless of validation result
      setInitialLoading(false);
    };
    
    initializeAuth();
  }, [jiraEmail, jiraApiToken, jiraDomain, filtersApplied]);

  // Handle search
  const handleSearch = async (filters: FilterOptions) => {
    console.log("Jira search triggered with filters:", filters);
    
    // Simple credentials validation check
    const isValid = !!jiraEmail && !!jiraApiToken && !!jiraDomain;
    if (!isValid) {
      setError("Your Jira authentication appears to be invalid. Try reconnecting in the Connections page.");
      return;
    }
    
    if (!jiraEmail || !jiraApiToken || !jiraDomain) return;
    
    setLoading(true);
    setError(null);
    setFilters(filters);
    setCurrentPage(1); // Reset to first page on new search
    
    try {
      // Build JQL query based on filters
      const jql = buildJqlQuery({
        projectKey: filters.projectKey,
        teamName: filters.teamName,
        startDate: filters.dateRange?.from,
        endDate: filters.dateRange?.to,
        additionalCriteria: undefined
      });
      
      console.log("Fetching Jira issues with JQL:", jql);
      const result = await fetchJiraIssuesByJql(jiraEmail, jiraApiToken, jiraDomain, jql);
      
      // Format issues for display
      const formattedIssues = result.issues.map((issue: any) => formatJiraIssue(issue));
      
      // Calculate pagination
      setIssues(formattedIssues.slice(0, PAGE_SIZE));
      setTotalItems(formattedIssues.length);
      setTotalPages(Math.max(1, Math.ceil(formattedIssues.length / PAGE_SIZE)));
      setFiltersApplied(true);
    } catch (err) {
      console.error("Error fetching Jira issues:", err);
      setError("Failed to fetch Jira issues. Please try again.");
      setIssues([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    // Simple credentials validation check
    const isValid = !!jiraEmail && !!jiraApiToken && !!jiraDomain;
    if (!isValid) {
      setError("Your Jira authentication appears to be invalid. Try reconnecting in the Connections page.");
      return;
    }
    
    if (!jiraEmail || !jiraApiToken || !jiraDomain) return;
    
    setCurrentPage(page);
    
    // Calculate start and end indices for pagination
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    
    // Get issues for the current page
    // This assumes we already have all issues loaded
    // For a real implementation, you might want to fetch issues for each page from the API
    const paginatedIssues = issues.slice(startIndex, endIndex);
    setIssues(paginatedIssues);
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
      
      {/* Show connection prompt if not authenticated */}
      {(!jiraEmail || !jiraApiToken || !jiraDomain) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-3 mb-4">
                <JiraIcon className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">Connect to Jira</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Connect your Jira account to view and track your issues.
              </p>
              <Link href="/connections">
                <Button>Connect Jira Account</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Show content if authenticated */}
      {jiraEmail && jiraApiToken && jiraDomain && (
        <Card>
          <CardHeader>
            <CardTitle>Jira Issues</CardTitle>
            <CardDescription>
              View and track your Jira issues across projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filter controls */}
            <div className="mb-6">
              <FilterControls 
                onSearch={handleSearch} 
                isLoading={loading}
                showProjectFilter={true}
                showTeamFilter={true}
              />
            </div>
            
            {/* Loading skeleton */}
            {loading && <JiraLoadingSkeleton />}
            
            {/* No filters applied yet message */}
            {!loading && !filtersApplied && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-md flex items-start">
                <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Apply filters to view your issues</p>
                  <p className="text-sm">Use the filters above to search for specific Jira issues.</p>
                </div>
              </div>
            )}
            
            {/* No issues found message */}
            {!loading && filtersApplied && issues.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No issues found matching your criteria.
              </p>
            )}
            
            {/* Issues list */}
            {!loading && filtersApplied && issues.length > 0 && (
              <>
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
                
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  Showing {issues.length} of {totalItems} issues
                </div>
                
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function IssueCard({ issue }: { issue: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">
              <a 
                href={issue.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline text-primary-600"
              >
                {issue.key}: {issue.summary}
              </a>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {issue.issueType} • {issue.priority}
            </p>
          </div>
          <Badge variant={issue.status === "Done" ? "secondary" : "default"}>
            {issue.status}
          </Badge>
        </div>
        <div className="mt-3 text-sm">
          <span>Created: {issue.created}</span>
          <span className="ml-2">Updated: {issue.updated}</span>
          <span className="ml-2">Assignee: {issue.assignee}</span>
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