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
  EyeOff,
  Loader
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { fetchUserRepositories } from "@/lib/github"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock data for non-GitHub connections
const initialConnectionStatus = {
  tafbadges: false
};

export function AccountConnections() {
  const auth = useAuth();
  
  // Safely access auth context properties
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user || null;
  const accessToken = auth?.accessToken || null;
  const setGitHubToken = auth?.setGitHubToken || (() => {});
  const logout = auth?.logout || (() => {});
  const loading = auth?.loading || false;
  const isJiraAuthenticated = auth?.isJiraAuthenticated || false;
  const jiraUser = auth?.jiraUser || null;
  const jiraEmail = auth?.jiraEmail || null;
  const jiraApiToken = auth?.jiraApiToken || null;
  const jiraDomain = auth?.jiraDomain || null;
  const setJiraCredentials = auth?.setJiraCredentials || (() => {});
  const logoutJira = auth?.logoutJira || (() => {});
  const jiraLoading = auth?.jiraLoading || false;
  
  /* Temporarily commented out Bitbucket functionality
  const isBitbucketAuthenticated = auth?.isBitbucketAuthenticated || false;
  const bitbucketToken = auth?.bitbucketToken || null;
  const setBitbucketToken = auth?.setBitbucketToken || (() => {});
  const logoutBitbucket = auth?.logoutBitbucket || (() => {});
  const bitbucketLoading = auth?.bitbucketLoading || false;
  */
  
  // Initial connection status
  const initialConnectionStatus = {
    /* Temporarily commented out TAF Badges
    tafbadges: false
    */
  };
  
  const [connections, setConnections] = useState(initialConnectionStatus);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [githubData, setGithubData] = useState<any>(null);
  const [disconnecting, setDisconnecting] = useState(false);
  const [jiraDisconnecting, setJiraDisconnecting] = useState(false);
  
  // Token input states
  const [githubToken, setGithubToken] = useState("");
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [connectingGithub, setConnectingGithub] = useState(false);
  const [connectingJira, setConnectingJira] = useState(false);
  
  // Atlassian input states
  const [atlassianEmail, setAtlassianEmail] = useState("");
  const [atlassianApiToken, setAtlassianApiToken] = useState("");
  const [atlassianDomain, setAtlassianDomain] = useState("");
  const [showAtlassianToken, setShowAtlassianToken] = useState(false);
  
  // Fetch GitHub data when authenticated
  useEffect(() => {
    const fetchGitHubData = async () => {
      if (isAuthenticated && accessToken && user) {
        try {
          // Fetch repositories
          const repos = await fetchUserRepositories(accessToken);
          
          setGithubData({
            repos,
            contributions: [],
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
  
  /* Temporarily commented out TAF Badges functionality
  const toggleConnection = (platform: keyof typeof connections) => {
    setConnections(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };
  */
  
  const handleGitHubConnect = async () => {
    if (!githubToken.trim()) return;
    
    setConnectingGithub(true);
    try {
      setGitHubToken(githubToken);
      setGithubToken("");
    } catch (error) {
      console.error("Error connecting GitHub:", error);
    } finally {
      setConnectingGithub(false);
    }
  };
  
  const handleJiraConnect = async () => {
    try {
      setConnectingJira(true);
      
      console.log("Connecting to Jira with domain:", atlassianDomain);
      
      if (atlassianEmail && atlassianApiToken && atlassianDomain) {
        console.log("Setting Jira credentials from account connections");
        setJiraCredentials(atlassianEmail, atlassianApiToken, atlassianDomain);
        
        // Clear the input fields after successful connection
        setAtlassianEmail("");
        setAtlassianApiToken("");
        setAtlassianDomain("");
      } else {
        console.error("Missing Jira credentials");
      }
    } catch (error) {
      console.error("Error connecting to Jira:", error);
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
    /* Temporarily commented out
    tafbadges: "Connect your TAF Badges account to track your earned certifications and learning achievements."
    */
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
            <CardHeader className="flex flex-row items-center gap-4">
              <GitHub className="w-8 h-8" />
              <div>
                <CardTitle>GitHub</CardTitle>
                <CardDescription>Connect to your GitHub account</CardDescription>
              </div>
              {isAuthenticated && (
                <CheckCircle className="w-6 h-6 ml-auto text-green-500" />
              )}
              {!isAuthenticated && !loading && (
                <XCircle className="w-6 h-6 ml-auto text-red-500" />
              )}
              {loading && (
                <Loader2 className="w-6 h-6 ml-auto animate-spin" />
              )}
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <div>
                  <div className="flex items-center mb-4">
                    <img
                      src={user?.avatar_url}
                      alt={user?.login}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-medium">{user?.name || user?.login}</div>
                      <div className="text-sm text-gray-500">@{user?.login}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Connected successfully</span>
                    </p>
                    <p className="mt-2 text-amber-600 dark:text-amber-400 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      <span>To view your GitHub data, go to the dashboard and select the GitHub tab, then use the filters to display your data.</span>
                    </p>
                  </div>
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleGitHubDisconnect}
                    disabled={disconnecting}
                    className="w-full"
                  >
                    {disconnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <Unlink className="mr-2 h-4 w-4" />
                        Disconnect
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="githubToken">Personal Access Token (PAT)</Label>
                      <div className="relative">
                        <Input
                          id="githubToken"
                          type={showGithubToken ? "text" : "password"}
                          placeholder="GitHub Personal Access Token"
                          value={githubToken}
                          onChange={(e) => setGithubToken(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowGithubToken(!showGithubToken)}
                        >
                          {showGithubToken ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleGitHubConnect} 
                      disabled={!githubToken || connectingGithub}
                      className="w-full"
                    >
                      {connectingGithub ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Connect
                        </>
                      )}
                    </Button>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Requires a GitHub Personal Access Token with<br/> 
                      <code>repo</code> and <code>read:user</code> scopes.
                    </p>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full text-xs"
                      onClick={() => window.open('https://github.com/settings/tokens/new', '_blank')}
                    >
                      <ExternalLink className="mr-2 h-3 w-3" />
                      Create a Token
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Atlassian Connection */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Trello className="w-8 h-8" />
              <div>
                <CardTitle>Atlassian (Jira)</CardTitle>
                <CardDescription>Connect to your Atlassian account</CardDescription>
              </div>
              {isJiraAuthenticated && (
                <CheckCircle className="w-6 h-6 ml-auto text-green-500" />
              )}
              {!isJiraAuthenticated && !jiraLoading && (
                <XCircle className="w-6 h-6 ml-auto text-red-500" />
              )}
              {jiraLoading && (
                <Loader2 className="w-6 h-6 ml-auto animate-spin" />
              )}
            </CardHeader>
            <CardContent>
              {isJiraAuthenticated ? (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                      <Trello className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium">{jiraUser?.displayName}</div>
                      <div className="text-sm text-gray-500">{jiraUser?.emailAddress}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Connected to domain: <strong>{jiraDomain}</strong></span>
                    </p>
                    <p className="mt-2 text-amber-600 dark:text-amber-400 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      <span>To view your Jira data, go to the dashboard and select the Jira tab, then use the filters to display your issues.</span>
                    </p>
                  </div>
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleJiraDisconnect}
                    disabled={jiraDisconnecting}
                    className="w-full"
                  >
                    {jiraDisconnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <Unlink className="mr-2 h-4 w-4" />
                        Disconnect
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="atlassian-email">Email</Label>
                      <Input
                        id="atlassian-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={atlassianEmail}
                        onChange={(e) => setAtlassianEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="atlassian-token">API Token</Label>
                      <div className="relative">
                        <Input
                          id="atlassian-token"
                          type={showAtlassianToken ? "text" : "password"}
                          placeholder="Enter your Atlassian API token"
                          value={atlassianApiToken}
                          onChange={(e) => setAtlassianApiToken(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowAtlassianToken(!showAtlassianToken)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showAtlassianToken ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="atlassian-domain">Domain</Label>
                      <Input
                        id="atlassian-domain"
                        type="text"
                        placeholder="yourcompany.atlassian.net"
                        value={atlassianDomain}
                        onChange={(e) => setAtlassianDomain(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleJiraConnect} 
                    disabled={!atlassianEmail || !atlassianApiToken || !atlassianDomain || connectingJira}
                    className="w-full"
                  >
                    {connectingJira ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Temporarily commented out Bitbucket functionality
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Backpack className="w-8 h-8" />
              <div>
                <CardTitle>Bitbucket</CardTitle>
                <CardDescription>Connect to your Bitbucket account</CardDescription>
              </div>
              {isBitbucketAuthenticated && (
                <CheckCircle className="w-6 h-6 ml-auto text-green-500" />
              )}
              {!isBitbucketAuthenticated && !bitbucketLoading && (
                <XCircle className="w-6 h-6 ml-auto text-red-500" />
              )}
              {bitbucketLoading && (
                <Loader2 className="w-6 h-6 ml-auto animate-spin" />
              )}
            </CardHeader>
            <CardContent>
              {isBitbucketAuthenticated ? (
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <p className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Connected successfully</span>
                    </p>
                  </div>
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => setBitbucketToken(null)}
                    className="w-full"
                  >
                    <Unlink className="mr-2 h-4 w-4" />
                    Disconnect Bitbucket
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bitbucket-token">API Token</Label>
                      <Input
                        id="bitbucket-token"
                        type="password"
                        placeholder="Enter your Bitbucket API token"
                      />
                    </div>
                    
                    <Button 
                      onClick={() => setBitbucketToken(null)}
                      className="w-full"
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Connect Bitbucket
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          */}
          
          {/* Temporarily commented out TAF Badges Connection */}
          {/* 
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
          */}
        </div>
      </CardContent>
    </Card>
  );
} 