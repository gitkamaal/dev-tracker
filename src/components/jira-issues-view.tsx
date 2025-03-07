"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  fetchJiraAssignedIssues, 
  fetchJiraCreatedIssues, 
  fetchJiraCompletedIssues, 
  fetchJiraProjects 
} from "@/lib/atlassian";
import { Trello, Clock, CheckCircle, AlertCircle, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function JiraIssuesView() {
  const auth = useAuth();
  
  // Safely access auth context properties
  const isJiraAuthenticated = auth?.isJiraAuthenticated || false;
  const jiraEmail = auth?.jiraEmail || null;
  const jiraApiToken = auth?.jiraApiToken || null;
  const jiraDomain = auth?.jiraDomain || null;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignedIssues, setAssignedIssues] = useState<any[]>([]);
  const [createdIssues, setCreatedIssues] = useState<any[]>([]);
  const [completedIssues, setCompletedIssues] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchJiraData = async () => {
      if (!isJiraAuthenticated || !jiraEmail || !jiraApiToken || !jiraDomain) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch data in parallel
        const [assignedData, createdData, completedData, projectsData] = await Promise.all([
          fetchJiraAssignedIssues(jiraEmail, jiraApiToken, jiraDomain),
          fetchJiraCreatedIssues(jiraEmail, jiraApiToken, jiraDomain),
          fetchJiraCompletedIssues(jiraEmail, jiraApiToken, jiraDomain),
          fetchJiraProjects(jiraEmail, jiraApiToken, jiraDomain)
        ]);
        
        setAssignedIssues(assignedData.issues || []);
        setCreatedIssues(createdData.issues || []);
        setCompletedIssues(completedData.issues || []);
        setProjects(projectsData.values || []);
      } catch (err) {
        console.error("Error fetching Jira data:", err);
        setError("Failed to fetch Jira data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchJiraData();
  }, [isJiraAuthenticated, jiraEmail, jiraApiToken, jiraDomain]);

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
            <span>Assigned</span>
          </TabsTrigger>
          <TabsTrigger value="created" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Created</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Completed</span>
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
                    <IssueCard key={issue.id} issue={issue} domain={jiraDomain!} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="created" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Issues I Created</CardTitle>
              <CardDescription>
                Issues you've created in Jira
              </CardDescription>
            </CardHeader>
            <CardContent>
              {createdIssues.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  You haven't created any issues.
                </p>
              ) : (
                <div className="space-y-4">
                  {createdIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} domain={jiraDomain!} />
                  ))}
                </div>
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
              {completedIssues.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No completed issues found.
                </p>
              ) : (
                <div className="space-y-4">
                  {completedIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} domain={jiraDomain!} />
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
                    <ProjectCard key={project.id} project={project} domain={jiraDomain!} />
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

function ProjectCard({ project, domain }: { project: any, domain: string }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <h3 className="font-medium">
          <a 
            href={`https://${domain}/browse/${project.key}`} 
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