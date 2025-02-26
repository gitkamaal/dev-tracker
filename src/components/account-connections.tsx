"use client"

import {
  GitlabIcon as GitHub,
  GithubIcon as Bitbucket,
  Trello,
  Book,
  CheckCircle,
  XCircle,
  Info,
  Backpack
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

// Mock data for demonstration
const initialConnectionStatus = {
  github: false,
  bitbucket: false,
  jira: false,
  confluence: false,
  tafbadges: false
};

export function AccountConnections() {
  const [connections, setConnections] = useState(initialConnectionStatus);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  
  const toggleConnection = (platform: keyof typeof connections) => {
    setConnections(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };
  
  const platformInfo = {
    github: "Connect your GitHub account to track commits, pull requests, and code reviews.",
    bitbucket: "Connect your Bitbucket account to track repositories, commits, and pull requests.",
    jira: "Connect your Jira account to track tickets, sprints, and project contributions.",
    confluence: "Connect your Confluence account to track documentation and knowledge sharing.",
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
          <div className="flex items-center space-x-2 text-sm text-gray-500">
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
          <div className="relative">
            <Button 
              variant={connections.github ? "default" : "outline"} 
              className={`h-auto py-5 w-full flex items-center justify-start space-x-4 transition-all ${
                connections.github ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30" : ""
              }`}
              onClick={() => toggleConnection("github")}
            >
              <div className="relative">
                <GitHub size={28} />
                {connections.github && (
                  <CheckCircle className="h-4 w-4 text-green-500 absolute -top-2 -right-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium text-base">GitHub</span>
                <span className="text-xs text-gray-500 mt-1">
                  {connections.github ? "Connected" : "Not Connected"}
                </span>
              </div>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => setShowInfo(showInfo === "github" ? null : "github")}
            >
              <Info className="h-4 w-4" />
            </Button>
            {showInfo === "github" && (
              <div className="absolute z-10 top-full left-0 right-0 mt-2 p-3 bg-white rounded-md shadow-lg text-sm text-gray-700 border border-gray-200">
                {platformInfo.github}
              </div>
            )}
          </div>
          
          <div className="relative">
            <Button 
              variant={connections.bitbucket ? "default" : "outline"} 
              className={`h-auto py-5 w-full flex items-center justify-start space-x-4 transition-all ${
                connections.bitbucket ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30" : ""
              }`}
              onClick={() => toggleConnection("bitbucket")}
            >
              <div className="relative">
                <Bitbucket size={28} />
                {connections.bitbucket && (
                  <CheckCircle className="h-4 w-4 text-green-500 absolute -top-2 -right-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium text-base">Bitbucket</span>
                <span className="text-xs text-gray-500 mt-1">
                  {connections.bitbucket ? "Connected" : "Not Connected"}
                </span>
              </div>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => setShowInfo(showInfo === "bitbucket" ? null : "bitbucket")}
            >
              <Info className="h-4 w-4" />
            </Button>
            {showInfo === "bitbucket" && (
              <div className="absolute z-10 top-full left-0 right-0 mt-2 p-3 bg-white rounded-md shadow-lg text-sm text-gray-700 border border-gray-200">
                {platformInfo.bitbucket}
              </div>
            )}
          </div>
          
          <div className="relative">
            <Button 
              variant={connections.jira ? "default" : "outline"} 
              className={`h-auto py-5 w-full flex items-center justify-start space-x-4 transition-all ${
                connections.jira ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30" : ""
              }`}
              onClick={() => toggleConnection("jira")}
            >
              <div className="relative">
                <Trello size={28} />
                {connections.jira && (
                  <CheckCircle className="h-4 w-4 text-green-500 absolute -top-2 -right-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium text-base">Jira</span>
                <span className="text-xs text-gray-500 mt-1">
                  {connections.jira ? "Connected" : "Not Connected"}
                </span>
              </div>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => setShowInfo(showInfo === "jira" ? null : "jira")}
            >
              <Info className="h-4 w-4" />
            </Button>
            {showInfo === "jira" && (
              <div className="absolute z-10 top-full left-0 right-0 mt-2 p-3 bg-white rounded-md shadow-lg text-sm text-gray-700 border border-gray-200">
                {platformInfo.jira}
              </div>
            )}
          </div>
          
          <div className="relative">
            <Button 
              variant={connections.confluence ? "default" : "outline"} 
              className={`h-auto py-5 w-full flex items-center justify-start space-x-4 transition-all ${
                connections.confluence ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30" : ""
              }`}
              onClick={() => toggleConnection("confluence")}
            >
              <div className="relative">
                <Book size={28} />
                {connections.confluence && (
                  <CheckCircle className="h-4 w-4 text-green-500 absolute -top-2 -right-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium text-base">Confluence</span>
                <span className="text-xs text-gray-500 mt-1">
                  {connections.confluence ? "Connected" : "Not Connected"}
                </span>
              </div>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => setShowInfo(showInfo === "confluence" ? null : "confluence")}
            >
              <Info className="h-4 w-4" />
            </Button>
            {showInfo === "confluence" && (
              <div className="absolute z-10 top-full left-0 right-0 mt-2 p-3 bg-white rounded-md shadow-lg text-sm text-gray-700 border border-gray-200">
                {platformInfo.confluence}
              </div>
            )}
          </div>
          
          <div className="relative">
            <Button 
              variant={connections.tafbadges ? "default" : "outline"} 
              className={`h-auto py-5 w-full flex items-center justify-start space-x-4 transition-all ${
                connections.tafbadges ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30" : ""
              }`}
              onClick={() => toggleConnection("tafbadges")}
            >
              <div className="relative">
                <Backpack size={28} />
                {connections.tafbadges && (
                  <CheckCircle className="h-4 w-4 text-green-500 absolute -top-2 -right-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium text-base">TAF Badges</span>
                <span className="text-xs text-gray-500 mt-1">
                  {connections.tafbadges ? "Connected" : "Not Connected"}
                </span>
              </div>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => setShowInfo(showInfo === "tafbadges" ? null : "tafbadges")}
            >
              <Info className="h-4 w-4" />
            </Button>
            {showInfo === "tafbadges" && (
              <div className="absolute z-10 top-full left-0 right-0 mt-2 p-3 bg-white rounded-md shadow-lg text-sm text-gray-700 border border-gray-200">
                {platformInfo.tafbadges}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 