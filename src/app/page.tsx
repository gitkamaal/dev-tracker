import { Navbar } from "@/components/navbar"
import { DashboardHeader } from "@/components/dashboard-header"
import { AccountConnections } from "@/components/account-connections"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { CompetencyMapping } from "@/components/competency-mapping"
import { BragSheetGenerator } from "@/components/brag-sheet-generator"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container mx-auto p-8">
        <DashboardHeader />
        <AccountConnections />
        <DashboardTabs />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <CompetencyMapping />
          <BragSheetGenerator />
        </div>
      </main>
    </div>
  )
}
