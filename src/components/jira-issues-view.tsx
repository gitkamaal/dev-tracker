"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAccessibleResources, fetchAssignedIssues, fetchRecentActivity, fetchProjects, formatJiraIssue } from "@/lib/jira";
import { Trello, Clock, CheckCircle, AlertCircle, FolderKanban } from "lucide-react";

export function JiraIssuesView() {
  const { jiraAccessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cloudId, setCloudId] = useState<string | null>(null);
  const [assignedIssues, setAssignedIssues] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchJiraData = async () => {
      if (!jiraAccessToken) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // First, get the accessible Jira sites
        const resources = await fetchAccessibleResources(jiraAccessToken);
        
        if (resources.length === 0) {
          setError("No Jira sites found. Please make sure you have access to at least one Jira site.");
          setLoading(false);
          return;
        }
        
        // Use the first site (most users only have one)
        const siteCloudId = resources[0].id;
        setCloudId(siteCloudId);
        
        // Fetch data in parallel
        const [issues, activity, projectsData] = await Promise.all([
          fetchAssignedIssues(jiraAccessToken, siteCloudId),
          fetchRecentActivity(jiraAccessToken, siteCloudId),
          fetchProjects(jiraAccessToken, siteCloudId)
        ]);
        
        setAssignedIssues(issues);
        setRecentActivity(activity);
        setProjects(projectsData);
      } catch (err) {
        console.error("Error fetching Jira data:", err);
        setError("Failed to fetch Jira data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchJiraData();
  }, [jiraAccessToken]);

  if (loading) {
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
      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="assigned" className="flex items-center gap-2">
            <Trello className="h-4 w-4" />
            <span>My Issues</span>
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Recent Activity</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            <span>Projects</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assigned" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>My Assigned Issues</CardTitle>
              <CardDescription>
                Issues currently assigned to you in Jira
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignedIssues.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  You don't have any issues assigned to you.
                </p>
              ) : (
                <div className="space-y-4">
                  {assignedIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Issues updated in the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No recent activity found.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Jira projects you have access to
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No projects found.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function IssueCard({ issue }: { issue: any }) {
  const formattedIssue = formatJiraIssue(issue);
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex flex-col space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">
              <a 
                href={formattedIssue.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline text-primary-600"
              >
                {formattedIssue.key}: {formattedIssue.summary}
              </a>
            </h3>
            <div className="flex items-center mt-1 space-x-2 text-sm text-muted-foreground">
              <span>Updated: {formattedIssue.updated}</span>
              <span>•</span>
              <span>Assignee: {formattedIssue.assignee}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Badge variant={getStatusVariant(formattedIssue.status)}>
            {formattedIssue.status}
          </Badge>
          <Badge variant="outline">{formattedIssue.issueType}</Badge>
          <Badge variant="outline">{formattedIssue.priority}</Badge>
        </div>
      </div>
    </Card>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <h3 className="font-medium">
          <a 
            href={`https://your-domain.atlassian.net/browse/${project.key}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline text-primary-600"
          >
            {project.name}
          </a>
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {project.key}
        </p>
        {project.description && (
          <p className="text-sm mt-2 line-clamp-2">
            {project.description}
          </p>
        )}
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
          <Card key={i} className="overflow-hidden">
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-full" />
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </Card>
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