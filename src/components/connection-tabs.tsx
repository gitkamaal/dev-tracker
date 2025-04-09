"use client";

import { useState } from "react";
import { JiraIcon } from "@/components/ui/jira-icon";
import { Github } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Eye, EyeOff, ExternalLink, Loader2 } from "lucide-react";

export function ConnectionTabs() {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState("github");
  
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
  
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

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
    <div className="w-full">
      <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
        <div className="flex -mb-px">
          <button
            onClick={() => handleTabChange("github")}
            className={`flex items-center px-6 py-3 font-medium text-sm border-b-2 ${activeTab === "github" ? 'text-primary-600 border-primary-600' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </button>
          <button
            onClick={() => handleTabChange("jira")}
            className={`flex items-center px-6 py-3 font-medium text-sm border-b-2 ${activeTab === "jira" ? 'text-primary-600 border-primary-600' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
          >
            <JiraIcon className="h-4 w-4 mr-2" />
            Jira
          </button>
        </div>
      </div>
      
      <div>
        {activeTab === "github" && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Github className="h-5 w-5" />
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
                    Create a token with these scopes:
                    <span className="block mt-2 mb-2">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-red-600 font-mono">repo</code>
                      <span className="text-xs ml-2">- for repository access</span>
                    </span>
                    <span className="block mb-2">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-red-600 font-mono">read:user</code>
                      <span className="text-xs ml-2">- for user information</span>
                    </span>
                    at{" "}
                    <a 
                      href="https://github.com/settings/tokens" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline flex items-center inline-flex"
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
        )}
        
        {activeTab === "jira" && (
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
                    Create an API token with:
                    <span className="block mt-2 mb-2">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-red-600 font-mono">read access</code>
                      <span className="text-xs ml-2">- for viewing issues and projects</span>
                    </span>
                    at{" "}
                    <a 
                      href="https://id.atlassian.com/manage-profile/security/api-tokens" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline flex items-center inline-flex"
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
        )}
      </div>
    </div>
  );
}
