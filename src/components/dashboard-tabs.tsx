import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityTimeline } from "@/components/activity-timeline"
import { MetricsDisplay } from "@/components/metrics-display"
import { ProjectsView } from "@/components/projects-view"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="timeline" className="space-y-4">
      <TabsList>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>
      
      <TabsContent value="timeline" className="space-y-4">
        <ActivityTimeline />
      </TabsContent>
      
      <TabsContent value="metrics" className="space-y-4">
        <MetricsDisplay />
      </TabsContent>
      
      <TabsContent value="projects" className="space-y-4">
        <ProjectsView />
      </TabsContent>
    </Tabs>
  )
} 