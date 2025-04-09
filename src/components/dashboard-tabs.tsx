"use client";

import { JiraIcon } from "@/components/ui/jira-icon";
import { Github } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { JiraIssuesView } from "@/components/jira-issues-view";
import { GitHubView } from "@/components/github-view";
import { useState } from "react";

export function DashboardTabs() {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState("jira-issues");
  
  // Check if we have GitHub token
  const hasGithubToken = !!auth?.accessToken;
  
  // Check if we have Jira token
  const hasJiraToken = !!auth?.jiraApiToken && !!auth?.jiraEmail && !!auth?.jiraDomain;

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  return (
    <div className="w-full">
      <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
        <div className="flex -mb-px">
          <button
            onClick={() => handleTabChange("jira-issues")}
            className={`flex items-center px-6 py-3 font-medium text-sm border-b-2 ${activeTab === "jira-issues" ? 'text-primary-600 border-primary-600' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
          >
            <JiraIcon className="h-4 w-4 mr-2" />
            Jira
          </button>
          <button
            onClick={() => handleTabChange("github")}
            className={`flex items-center px-6 py-3 font-medium text-sm border-b-2 ${activeTab === "github" ? 'text-primary-600 border-primary-600' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </button>
        </div>
      </div>
      
      <div>
        {activeTab === "jira-issues" && <JiraIssuesView />}
        {activeTab === "github" && <GitHubView />}
      </div>
    </div>
  );
}