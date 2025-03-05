"use client"

import {
  GithubIcon as GitHub,
  Trello,
  Book,
  CheckCircle,
  XCircle,
  Info,
  Backpack,
  Link as LinkIcon,
  Unlink,
  AlertCircle,
  Check,
  Loader2,
  ExternalLink,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { fetchUserRepositories, fetchUserContributions } from "@/lib/github"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock data for non-GitHub connections
const initialConnectionStatus = {
  tafbadges: false
};

export function AccountConnections() {
  const { 
    isAuthenticated, 
    user, 
    accessToken, 
    setGitHubToken, 
    logout, 
    loading,
    isJiraAuthenticated,
    jiraUser,
    setJiraToken,
    logoutJira,
    jiraLoading
  } = useAuth();
  
  const [connections, setConnections] = useState(initialConnectionStatus);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [githubData, setGithubData] = useState<any>(null);
  const [disconnecting, setDisconnecting] = useState(false);
  const [jiraDisconnecting, setJiraDisconnecting] = useState(false);
  
  // Token input states
  const [githubToken, setGithubTokenInput] = useState("");
  const [jiraToken, setJiraTokenInput] = useState("");
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [showJiraToken, setShowJiraToken] = useState(false);
  const [connectingGithub, setConnectingGithub] = useState(false);
  const [connectingJira, setConnectingJira] = useState(false);
  
  // Fetch GitHub data when authenticated
  useEffect(() => {
    const fetchGitHubData = async () => {
      if (isAuthenticated && accessToken && user) {
        try {
          // Fetch repositories and contributions in parallel
          const [repos, contributions] = await Promise.all([
            fetchUserRepositories(accessToken),
            fetchUserContributions(accessToken, user.login)
          ]);
          
          setGithubData({
            repos,
            contributions,
            username: user.login,
            avatar: user.avatar_url
          });
        } catch (error) {
          console.error('Error fetching GitHub data:', error);
        }
      }
    };
    
    fetchGitHubData();
  }, [isAuthenticated, accessToken, user]);
  
  const toggleConnection = (platform: keyof typeof connections) => {
    setConnections(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };
  
  const handleGitHubConnect = async () => {
    if (!githubToken.trim()) return;
    
    setConnectingGithub(true);
    try {
      setGitHubToken(githubToken);
      setGithubTokenInput("");
    } catch (error) {
      console.error("Error connecting GitHub:", error);
    } finally {
      setConnectingGithub(false);
    }
  };
  
  const handleJiraConnect = async () => {
    if (!jiraToken.trim()) return;
    
    setConnectingJira(true);
    try {
      setJiraToken(jiraToken);
      setJiraTokenInput("");
    } catch (error) {
      console.error("Error connecting Jira:", error);
    } finally {
      setConnectingJira(false);
    }
  };
  
  const handleGitHubDisconnect = async () => {
    setDisconnecting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      logout();
    } catch (error) {
      console.error("Error disconnecting GitHub:", error);
    } finally {
      setDisconnecting(false);
    }
  };

  const handleJiraDisconnect = async () => {
    setJiraDisconnecting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      logoutJira();
    } catch (error) {
      console.error("Error disconnecting Atlassian:", error);
    } finally {
      setJiraDisconnecting(false);
    }
  };
  
  const platformInfo = {
    github: "Connect your GitHub account to track commits, pull requests, and code reviews.",
    atlassian: "Connect your Atlassian account to track Jira issues, Confluence pages, and Bitbucket repositories.",
    tafbadges: "Connect your TAF Badges account to track your earned certifications and learning achievements."
  };
  
  return (
    <Card className="mb-8 border-t-4 border-t-red-600">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Connect Your Accounts</CardTitle>
            <CardDescription className="mt-2 text-sm">
              Link your external accounts to start tracking your accomplishments
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Connected
            </span>
            <span className="flex items-center">
              <XCircle className="h-4 w-4 text-gray-400 mr-1" />
              Not Connected
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* GitHub Connection */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center">
                <GitHub className="mr-2 h-4 w-4" />
                GitHub
              </CardTitle>
              <CardDescription>
                Connect to your GitHub account to track your commits, PRs, and issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Connected as {user?.login}</span>
                  </div>
                  {user?.avatar_url && (
                    <div className="flex items-center space-x-2">
                      <img 
                        src={user.avatar_url} 
                        alt={`${user.login}'s avatar`} 
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{user.name || user.login}</p>
                        <p className="text-xs text-muted-foreground">{user.email || ''}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <span>Not connected</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="github-token">Personal Access Token</Label>
                    <div className="flex">
                      <div className="relative flex-grow">
                        <Input
                          id="github-token"
                          type={showGithubToken ? "text" : "password"}
                          placeholder="Enter your GitHub personal access token"
                          value={githubToken}
                          onChange={(e) => setGithubTokenInput(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowGithubToken(!showGithubToken)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showGithubToken ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <a 
                        href="https://github.com/settings/tokens" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline flex items-center"
                      >
                        Generate a token <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                      <span className="block mt-1">
                        Required scopes: repo, user
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {isAuthenticated ? (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGitHubDisconnect}
                  disabled={disconnecting}
                >
                  {disconnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    'Disconnect'
                  )}
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={handleGitHubConnect}
                  disabled={connectingGithub || !githubToken.trim()}
                >
                  {connectingGithub ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect GitHub'
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {/* Atlassian Connection */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center">
                <Trello className="mr-2 h-4 w-4" />
                Atlassian
              </CardTitle>
              <CardDescription>
                Connect to your Atlassian account to track Jira issues, Confluence pages, and Bitbucket repositories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {jiraLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : isJiraAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Connected as {jiraUser?.name || jiraUser?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="text-sm font-medium">{jiraUser?.name || 'Atlassian User'}</p>
                      <p className="text-xs text-muted-foreground">{jiraUser?.email || ''}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <span>Not connected</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jira-token">API Token</Label>
                    <div className="flex">
                      <div className="relative flex-grow">
                        <Input
                          id="jira-token"
                          type={showJiraToken ? "text" : "password"}
                          placeholder="Enter your Atlassian API token"
                          value={jiraToken}
                          onChange={(e) => setJiraTokenInput(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowJiraToken(!showJiraToken)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showJiraToken ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <a 
                        href="https://id.atlassian.com/manage-profile/security/api-tokens" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline flex items-center"
                      >
                        Create an API token <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {isJiraAuthenticated ? (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleJiraDisconnect}
                  disabled={jiraDisconnecting}
                >
                  {jiraDisconnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    'Disconnect'
                  )}
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={handleJiraConnect}
                  disabled={connectingJira || !jiraToken.trim()}
                >
                  {connectingJira ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect Atlassian'
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {/* TAF Badges Connection */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center">
                <Backpack className="mr-2 h-4 w-4" />
                TAF Badges
              </CardTitle>
              <CardDescription>
                Connect to your TAF Badges account to track your certifications and learning achievements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {connections.tafbadges ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Connected as TAF User</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="text-sm font-medium">TAF User</p>
                      <p className="text-xs text-muted-foreground">user@example.com</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Not connected</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant={connections.tafbadges ? "outline" : "default"}
                className="w-full" 
                onClick={() => toggleConnection("tafbadges")}
              >
                {connections.tafbadges ? 'Disconnect' : 'Connect TAF Badges'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
} 