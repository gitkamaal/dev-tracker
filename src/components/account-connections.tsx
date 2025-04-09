"use client"

import {
  GithubIcon as GitHub,
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
import { fetchJiraProfile } from "@/lib/atlassian"
import { JiraIcon } from "@/components/ui/jira-icon"

interface ConnectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected";
  statusText: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

function ConnectionCard({
  title,
  description,
  icon,
  status,
  statusText,
  onConnect,
  onDisconnect,
  loading,
  children,
}: ConnectionCardProps) {
  const auth = useAuth();
  
  // Safely access auth context properties
  const accessToken = auth?.accessToken || null;
  const jiraEmail = auth?.jiraEmail || null;
  const jiraApiToken = auth?.jiraApiToken || null;
  const jiraDomain = auth?.jiraDomain || null;
  
  // Token input states
  const [githubToken, setGithubToken] = useState("");
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [connectingGithub, setConnectingGithub] = useState(false);
  const [connectingJira, setConnectingJira] = useState(false);
  
  // Jira input states
  const [jiraEmailInput, setJiraEmailInput] = useState("");
  const [jiraApiTokenInput, setJiraApiTokenInput] = useState("");
  const [jiraDomainInput, setJiraDomainInput] = useState("");
  const [showJiraToken, setShowJiraToken] = useState(false);
  
  // Error states
  const [githubError, setGithubError] = useState<string | null>(null);
  const [jiraError, setJiraError] = useState<string | null>(null);
  
  // Handle GitHub connection
  const handleConnectGitHub = async () => {
    if (!githubToken.trim()) {
      setGithubError("Please enter a valid GitHub token");
      return;
    }
    
    setConnectingGithub(true);
    setGithubError(null);
    
    try {
      // Save the token to localStorage directly since we removed the auth context function
      localStorage.setItem('githubToken', githubToken);
      window.location.reload(); // Reload to apply the token
    } catch (error) {
      console.error("Error connecting GitHub:", error);
      setGithubError("Failed to connect GitHub. Please try again.");
    } finally {
      setConnectingGithub(false);
    }
  };
  
  // Handle GitHub disconnection
  const handleDisconnectGitHub = () => {
    try {
      // Remove the token from localStorage directly
      localStorage.removeItem('githubToken');
      window.location.reload(); // Reload to apply the changes
    } catch (error) {
      console.error("Error disconnecting GitHub:", error);
    }
  };
  
  // Handle Jira connection
  const handleConnectJira = async () => {
    if (!jiraEmailInput.trim() || !jiraApiTokenInput.trim() || !jiraDomainInput.trim()) {
      setJiraError("Please fill in all Jira fields");
      return;
    }
    
    setConnectingJira(true);
    setJiraError(null);
    
    try {
      // Validate the credentials by attempting to fetch the profile
      await fetchJiraProfile(jiraEmailInput, jiraApiTokenInput, jiraDomainInput);
      
      // Save the credentials to localStorage directly
      localStorage.setItem('jiraEmail', jiraEmailInput);
      localStorage.setItem('jiraApiToken', jiraApiTokenInput);
      localStorage.setItem('jiraDomain', jiraDomainInput);
      
      window.location.reload(); // Reload to apply the credentials
    } catch (error) {
      console.error("Error connecting Jira:", error);
      setJiraError("Failed to connect Jira. Please check your credentials and try again.");
    } finally {
      setConnectingJira(false);
    }
  };
  
  // Handle Jira disconnection
  const handleDisconnectJira = () => {
    try {
      // Remove the credentials from localStorage directly
      localStorage.removeItem('jiraEmail');
      localStorage.removeItem('jiraApiToken');
      localStorage.removeItem('jiraDomain');
      
      window.location.reload(); // Reload to apply the changes
    } catch (error) {
      console.error("Error disconnecting Jira:", error);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-2 rounded-full">
              {icon}
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center">
            {status === "connected" ? (
              <div className="flex items-center text-green-600 dark:text-green-500">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>{statusText}</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <XCircle className="h-5 w-5 mr-2" />
                <span>{statusText}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

export function AccountConnections() {
  const auth = useAuth();
  
  // Safely access auth context properties
  const accessToken = auth?.accessToken || null;
  const jiraEmail = auth?.jiraEmail || null;
  const jiraApiToken = auth?.jiraApiToken || null;
  const jiraDomain = auth?.jiraDomain || null;
  
  // Token input states
  const [githubToken, setGithubToken] = useState("");
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [connectingGithub, setConnectingGithub] = useState(false);
  const [connectingJira, setConnectingJira] = useState(false);
  
  // Jira input states
  const [jiraEmailInput, setJiraEmailInput] = useState("");
  const [jiraApiTokenInput, setJiraApiTokenInput] = useState("");
  const [jiraDomainInput, setJiraDomainInput] = useState("");
  const [showJiraToken, setShowJiraToken] = useState(false);
  
  // Error states
  const [githubError, setGithubError] = useState<string | null>(null);
  const [jiraError, setJiraError] = useState<string | null>(null);
  
  // Handle GitHub connection
  const handleConnectGitHub = async () => {
    if (!githubToken.trim()) {
      setGithubError("Please enter a valid GitHub token");
      return;
    }
    
    setConnectingGithub(true);
    setGithubError(null);
    
    try {
      // Save the token to localStorage directly since we removed the auth context function
      localStorage.setItem('githubToken', githubToken);
      window.location.reload(); // Reload to apply the token
    } catch (error) {
      console.error("Error connecting GitHub:", error);
      setGithubError("Failed to connect GitHub. Please try again.");
    } finally {
      setConnectingGithub(false);
    }
  };
  
  // Handle GitHub disconnection
  const handleDisconnectGitHub = () => {
    try {
      // Remove the token from localStorage directly
      localStorage.removeItem('githubToken');
      window.location.reload(); // Reload to apply the changes
    } catch (error) {
      console.error("Error disconnecting GitHub:", error);
    }
  };
  
  // Handle Jira connection
  const handleConnectJira = async () => {
    if (!jiraEmailInput.trim() || !jiraApiTokenInput.trim() || !jiraDomainInput.trim()) {
      setJiraError("Please fill in all Jira fields");
      return;
    }
    
    setConnectingJira(true);
    setJiraError(null);
    
    try {
      // Validate the credentials by attempting to fetch the profile
      await fetchJiraProfile(jiraEmailInput, jiraApiTokenInput, jiraDomainInput);
      
      // Save the credentials to localStorage directly
      localStorage.setItem('jiraEmail', jiraEmailInput);
      localStorage.setItem('jiraApiToken', jiraApiTokenInput);
      localStorage.setItem('jiraDomain', jiraDomainInput);
      
      window.location.reload(); // Reload to apply the credentials
    } catch (error) {
      console.error("Error connecting Jira:", error);
      setJiraError("Failed to connect Jira. Please check your credentials and try again.");
    } finally {
      setConnectingJira(false);
    }
  };
  
  // Handle Jira disconnection
  const handleDisconnectJira = () => {
    try {
      // Remove the credentials from localStorage directly
      localStorage.removeItem('jiraEmail');
      localStorage.removeItem('jiraApiToken');
      localStorage.removeItem('jiraDomain');
      
      window.location.reload(); // Reload to apply the changes
    } catch (error) {
      console.error("Error disconnecting Jira:", error);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Account Connections</h2>
      <p className="text-muted-foreground">
        Connect your accounts to track your development activities.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* GitHub Connection Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <GitHub className="h-5 w-5" />
              <CardTitle>GitHub</CardTitle>
            </div>
            <CardDescription>
              Connect your GitHub account to track your pull requests and commits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {accessToken ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span>Connected to GitHub</span>
                </div>
                
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnectGitHub}
                >
                  Disconnect GitHub
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {githubError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-4">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{githubError}</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="github-token">Personal Access Token</Label>
                  <div className="relative">
                    <Input
                      id="github-token"
                      type={showGithubToken ? "text" : "password"}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowGithubToken(!showGithubToken)}
                    >
                      {showGithubToken ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          {!accessToken && (
            <CardFooter className="flex flex-col items-start space-y-4">
              <div className="w-full">
                <p className="text-sm text-muted-foreground mb-4">
                  Create a token with <code>repo</code> scope at{" "}
                  <a 
                    href="https://github.com/settings/tokens" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline inline-flex items-center"
                  >
                    GitHub Settings <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </p>
                <Button 
                  onClick={handleConnectGitHub}
                  disabled={connectingGithub}
                  className="w-full"
                >
                  {connectingGithub ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect GitHub"
                  )}
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
        
        {/* Jira Connection Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <JiraIcon className="h-5 w-5" />
              <CardTitle>Jira</CardTitle>
            </div>
            <CardDescription>
              Connect your Jira account to track your issues and projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {jiraEmail && jiraApiToken && jiraDomain ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span>Connected to Jira</span>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{jiraEmail}</p>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p className="text-sm font-medium">Domain</p>
                  <p className="text-sm text-muted-foreground">{jiraDomain}</p>
                </div>
                
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnectJira}
                >
                  Disconnect Jira
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jiraError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-4">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{jiraError}</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="jira-email">Jira Email</Label>
                  <Input
                    id="jira-email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={jiraEmailInput}
                    onChange={(e) => setJiraEmailInput(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jira-token">Jira API Token</Label>
                  <div className="relative">
                    <Input
                      id="jira-token"
                      type={showJiraToken ? "text" : "password"}
                      placeholder="ATATT3xFfGF0aQVKh..."
                      value={jiraApiTokenInput}
                      onChange={(e) => setJiraApiTokenInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowJiraToken(!showJiraToken)}
                    >
                      {showJiraToken ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jira-domain">Jira Domain</Label>
                  <Input
                    id="jira-domain"
                    type="text"
                    placeholder="your-company.atlassian.net"
                    value={jiraDomainInput}
                    onChange={(e) => setJiraDomainInput(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Your Jira domain, e.g., <code>your-company.atlassian.net</code>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          {!jiraEmail && !jiraApiToken && !jiraDomain && (
            <CardFooter className="flex flex-col items-start space-y-4">
              <div className="w-full">
                <p className="text-sm text-muted-foreground mb-4">
                  Create an API token at{" "}
                  <a 
                    href="https://id.atlassian.com/manage-profile/security/api-tokens" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline inline-flex items-center"
                  >
                    Atlassian Account Settings <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </p>
                <Button 
                  onClick={handleConnectJira}
                  disabled={connectingJira}
                  className="w-full"
                >
                  {connectingJira ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect Jira"
                  )}
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}