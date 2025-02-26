import { Navbar } from "@/components/navbar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { CompetencyMapping } from "@/components/competency-mapping"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto py-10 px-6 md:px-8">
        <DashboardHeader />
        
        <div className="mt-10">
          <DashboardTabs />
        </div>
        
        <div className="mt-12">
          <CompetencyMapping />
        </div>
      </main>
    </div>
  )
}
