"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, CheckCircle2, GitPullRequest, MessageSquare, FileText, GitBranch, BookOpen, Code } from 'lucide-react';
import { 
  fetchJiraProjects, 
  fetchJiraAssignedIssues, 
  fetchJiraCreatedIssues, 
  fetchJiraCompletedIssues,
  fetchConfluenceSpaces,
  fetchConfluencePages,
  fetchBitbucketRepositories
} from '@/lib/atlassian';

export function AtlassianProfileView() {
  const auth = useAuth();
  
  // Safely access auth context properties
  const isJiraAuthenticated = auth?.isJiraAuthenticated || false;
  const jiraUser = auth?.jiraUser || null;
  const jiraEmail = auth?.jiraEmail || null;
  const jiraApiToken = auth?.jiraApiToken || null;
  const jiraDomain = auth?.jiraDomain || null;
  const setJiraCredentials = auth?.setJiraCredentials || (() => {});
  const logoutJira = auth?.logoutJira || (() => {});
  const jiraLoading = auth?.jiraLoading || false;
  
  const [activeTab, setActiveTab] = useState('jira');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Jira data
  const [jiraProjects, setJiraProjects] = useState<any[]>([]);
  const [assignedIssues, setAssignedIssues] = useState<any[]>([]);
  const [createdIssues, setCreatedIssues] = useState<any[]>([]);
  const [completedIssues, setCompletedIssues] = useState<any[]>([]);
  
  // Confluence data
  const [confluenceSpaces, setConfluenceSpaces] = useState<any[]>([]);
  const [confluencePages, setConfluencePages] = useState<any[]>([]);
  
  // Bitbucket data
  const [bitbucketRepos, setBitbucketRepos] = useState<any[]>([]);
  
  useEffect(() => {
    if (isJiraAuthenticated && jiraUser && jiraEmail && jiraApiToken && jiraDomain) {
      fetchData();
    }
  }, [isJiraAuthenticated, jiraUser, jiraEmail, jiraApiToken, jiraDomain]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Jira data
      if (jiraEmail && jiraApiToken && jiraDomain) {
        const [projects, assignedIssues, createdIssues, completedIssues] = await Promise.all([
          fetchJiraProjects(jiraEmail, jiraApiToken, jiraDomain),
          fetchJiraAssignedIssues(jiraEmail, jiraApiToken, jiraDomain),
          fetchJiraCreatedIssues(jiraEmail, jiraApiToken, jiraDomain),
          fetchJiraCompletedIssues(jiraEmail, jiraApiToken, jiraDomain)
        ]);
        
        setJiraProjects(projects.values || []);
        setAssignedIssues(assignedIssues.issues || []);
        setCreatedIssues(createdIssues.issues || []);
        setCompletedIssues(completedIssues.issues || []);
      }
      
      // Fetch Confluence data
      if (jiraEmail && jiraApiToken && jiraDomain) {
        const [spaces, pages] = await Promise.all([
          fetchConfluenceSpaces(jiraEmail, jiraApiToken, jiraDomain),
          fetchConfluencePages(jiraEmail, jiraApiToken, jiraDomain)
        ]);
        
        setConfluenceSpaces(spaces.results || []);
        setConfluencePages(pages.results || []);
      }
      
      // Fetch Bitbucket data
      if (jiraEmail && jiraApiToken && jiraDomain) {
        const repos = await fetchBitbucketRepositories(jiraEmail, jiraApiToken, jiraDomain);
        setBitbucketRepos(repos.values || []);
      }
    } catch (error) {
      console.error("Error fetching Atlassian data:", error);
      setError("Failed to fetch Atlassian data. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleConnectAtlassian = () => {
    // Show a modal or form to collect credentials
    const token = prompt("Enter your Atlassian Personal Access Token:");
    const domain = prompt("Enter your Atlassian domain (e.g., yourcompany.atlassian.net):");
    
    if (token && domain) {
      setJiraCredentials(token, domain);
    }
  };
  
  if (jiraLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atlassian Profile</CardTitle>
          <CardDescription>Loading your Atlassian data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!isJiraAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atlassian Profile</CardTitle>
          <CardDescription>Connect your Atlassian account to see your data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your Atlassian account to view your Jira issues, Confluence pages, and Bitbucket repositories.
          </p>
          <Button onClick={handleConnectAtlassian}>
            Connect Atlassian
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atlassian Profile</CardTitle>
          <CardDescription>Error loading your Atlassian data</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={fetchData} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Atlassian Profile</CardTitle>
            <CardDescription>Your Atlassian activity and information</CardDescription>
          </div>
          {jiraUser && (
            <Avatar className="h-10 w-10">
              {jiraUser.avatarUrls && (
                <AvatarImage src={jiraUser.avatarUrls["48x48"]} alt={jiraUser.displayName} />
              )}
              <AvatarFallback>{jiraUser.displayName?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {jiraUser && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold">{jiraUser.displayName}</h3>
            <p className="text-sm text-muted-foreground">{jiraUser.emailAddress}</p>
            {jiraUser.timeZone && (
              <p className="text-xs text-muted-foreground mt-1">Timezone: {jiraUser.timeZone}</p>
            )}
          </div>
        )}
        
        <Tabs defaultValue="jira" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jira">Jira</TabsTrigger>
            <TabsTrigger value="confluence">Confluence</TabsTrigger>
            <TabsTrigger value="bitbucket">Bitbucket</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jira" className="space-y-4 mt-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <h4 className="text-sm font-medium">Assigned Issues</h4>
                    <p className="text-2xl font-bold">{assignedIssues.length}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <h4 className="text-sm font-medium">Created Issues</h4>
                    <p className="text-2xl font-bold">{createdIssues.length}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <h4 className="text-sm font-medium">Completed Issues</h4>
                    <p className="text-2xl font-bold">{completedIssues.length}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-semibold mb-2">Projects ({jiraProjects.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {jiraProjects.slice(0, 10).map((project) => (
                      <Badge key={project.id} variant="outline">
                        {project.name}
                      </Badge>
                    ))}
                    {jiraProjects.length > 10 && (
                      <Badge variant="outline">+{jiraProjects.length - 10} more</Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-semibold mb-2">Assigned Issues</h3>
                  {assignedIssues.length > 0 ? (
                    <div className="space-y-2">
                      {assignedIssues.slice(0, 5).map((issue) => (
                        <div key={issue.id} className="bg-muted/50 p-2 rounded-md">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5">
                              <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{issue.key}: {issue.fields.summary}</p>
                              <p className="text-xs text-muted-foreground">
                                {issue.fields.status?.name} • Priority: {issue.fields.priority?.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {assignedIssues.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center">
                          + {assignedIssues.length - 5} more issues
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No assigned issues found.</p>
                  )}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="confluence" className="space-y-4 mt-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <h4 className="text-sm font-medium">Spaces</h4>
                    <p className="text-2xl font-bold">{confluenceSpaces.length}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <h4 className="text-sm font-medium">Pages</h4>
                    <p className="text-2xl font-bold">{confluencePages.length}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-semibold mb-2">Recent Pages</h3>
                  {confluencePages.length > 0 ? (
                    <div className="space-y-2">
                      {confluencePages.slice(0, 5).map((page) => (
                        <div key={page.id} className="bg-muted/50 p-2 rounded-md">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{page.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {page.space?.name} • Last updated: {new Date(page.version?.when).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {confluencePages.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center">
                          + {confluencePages.length - 5} more pages
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No Confluence pages found.</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-md font-semibold mb-2">Spaces</h3>
                  <div className="flex flex-wrap gap-2">
                    {confluenceSpaces.slice(0, 10).map((space) => (
                      <Badge key={space.id} variant="outline">
                        {space.name}
                      </Badge>
                    ))}
                    {confluenceSpaces.length > 10 && (
                      <Badge variant="outline">+{confluenceSpaces.length - 10} more</Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="bitbucket" className="space-y-4 mt-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <h4 className="text-sm font-medium">Repositories</h4>
                  <p className="text-2xl font-bold">{bitbucketRepos.length}</p>
                </div>
                
                <div>
                  <h3 className="text-md font-semibold mb-2">Your Repositories</h3>
                  {bitbucketRepos.length > 0 ? (
                    <div className="space-y-2">
                      {bitbucketRepos.slice(0, 5).map((repo) => (
                        <div key={repo.uuid} className="bg-muted/50 p-2 rounded-md">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5">
                              <Code className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{repo.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {repo.project?.name} • {repo.language || 'No language specified'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {bitbucketRepos.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center">
                          + {bitbucketRepos.length - 5} more repositories
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No Bitbucket repositories found.</p>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </CardFooter>
    </Card>
  );
} 