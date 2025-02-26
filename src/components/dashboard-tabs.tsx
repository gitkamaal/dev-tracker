import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityTimeline } from "@/components/activity-timeline"
import { MetricsDisplay } from "@/components/metrics-display"
import { ProjectsView } from "@/components/projects-view"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="timeline" className="space-y-6">
      <TabsList className="mb-2">
        <TabsTrigger value="timeline" className="px-6 py-2.5">Timeline</TabsTrigger>
        <TabsTrigger value="metrics" className="px-6 py-2.5">Metrics</TabsTrigger>
        <TabsTrigger value="projects" className="px-6 py-2.5">Projects</TabsTrigger>
      </TabsList>
      
      <TabsContent value="timeline" className="space-y-6 pt-2">
        <ActivityTimeline />
      </TabsContent>
      
      <TabsContent value="metrics" className="space-y-6 pt-2">
        <MetricsDisplay />
      </TabsContent>
      
      <TabsContent value="projects" className="space-y-6 pt-2">
        <ProjectsView />
      </TabsContent>
    </Tabs>
  )
} 