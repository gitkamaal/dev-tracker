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

// Use dynamic import for BitbucketView
/* Temporarily commented out Bitbucket functionality
const BitbucketView = dynamic(() => import('../components/bitbucket-view').then(mod => ({ default: mod.BitbucketView })), {
  loading: () => <div className="p-8 text-center">Loading Bitbucket view...</div>,
  ssr: false
})
*/

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
        {/* Temporarily commented out Bitbucket tab
        <TabsTrigger value="bitbucket" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M5.8 11.3 2 4.5h20l-3.8 6.8a1 1 0 0 1-.9.5h-10a1 1 0 0 1-.9-.5z" />
            <path d="M10 19.5 8 22" />
            <path d="m14 19.5 2 2.5" />
            <path d="M5.2 11.3 6.6 19h10.8l1.4-7.7" />
          </svg>
          <span>Bitbucket</span>
        </TabsTrigger>
        */}
      </TabsList>
      
      <TabsContent value="jira" className="mt-0">
        <JiraIssuesView />
      </TabsContent>
      
      <TabsContent value="github" className="mt-0">
        <GitHubView />
      </TabsContent>
      
      {/* Temporarily commented out Bitbucket content
      <TabsContent value="bitbucket" className="mt-0">
        <BitbucketView />
      </TabsContent>
      */}
    </Tabs>
  )
} 