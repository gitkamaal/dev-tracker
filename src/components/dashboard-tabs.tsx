"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityTimeline } from "@/components/activity-timeline"
import { MetricsDisplay } from "@/components/metrics-display"
import { ProjectsView } from "@/components/projects-view"
import { JiraIssuesView } from "@/components/jira-issues-view"
import { useAuth } from "@/contexts/auth-context"
import { Clock, BarChart, FolderKanban, Trello } from "lucide-react"

export function DashboardTabs() {
  const { isAuthenticated, isJiraAuthenticated } = useAuth();

  return (
    <Tabs defaultValue="timeline" className="w-full">
      <TabsList className="flex bg-gray-100 dark:bg-gray-800 rounded-md mb-8">
        <TabsTrigger value="timeline" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400">
          <Clock className="h-4 w-4" />
          <span>Timeline</span>
        </TabsTrigger>
        <TabsTrigger value="metrics" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400">
          <BarChart className="h-4 w-4" />
          <span>Metrics</span>
        </TabsTrigger>
        <TabsTrigger value="projects" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400">
          <FolderKanban className="h-4 w-4" />
          <span>Projects</span>
        </TabsTrigger>
        {isJiraAuthenticated && (
          <TabsTrigger value="jira" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400">
            <Trello className="h-4 w-4" />
            <span>Jira</span>
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="timeline" className="mt-0">
        <ActivityTimeline />
      </TabsContent>
      
      <TabsContent value="metrics" className="mt-0">
        <MetricsDisplay />
      </TabsContent>
      
      <TabsContent value="projects" className="mt-0">
        <ProjectsView />
      </TabsContent>
      
      {isJiraAuthenticated && (
        <TabsContent value="jira" className="mt-0">
          <JiraIssuesView />
        </TabsContent>
      )}
    </Tabs>
  )
} 