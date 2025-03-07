"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JiraIssuesView } from "@/components/jira-issues-view"
import { useAuth } from "@/contexts/auth-context"
import { Trello, Github } from "lucide-react"
import dynamic from 'next/dynamic'

// Use dynamic import for GitHubView to avoid module not found errors
const GitHubView = dynamic(() => import('../components/github-view').then(mod => ({ default: mod.GitHubView })), {
  loading: () => <div className="p-8 text-center">Loading GitHub view...</div>,
  ssr: false
})

export function DashboardTabs() {
  const auth = useAuth();
  
  // Safely access auth context properties
  const isAuthenticated = auth?.isAuthenticated || false;
  const isJiraAuthenticated = auth?.isJiraAuthenticated || false;

  return (
    <Tabs defaultValue="jira" className="w-full">
      <TabsList className="flex bg-gray-100 dark:bg-gray-800 rounded-md mb-8">
        <TabsTrigger value="jira" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400">
          <Trello className="h-4 w-4" />
          <span>Jira</span>
        </TabsTrigger>
        <TabsTrigger value="github" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400">
          <Github className="h-4 w-4" />
          <span>GitHub</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="jira" className="mt-0">
        <JiraIssuesView />
      </TabsContent>
      
      <TabsContent value="github" className="mt-0">
        <GitHubView />
      </TabsContent>
    </Tabs>
  )
} 