import { Navbar } from "@/components/navbar"
import { ConnectionTabs } from "@/components/connection-tabs"

export default function ConnectionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Account Connections</h2>
        </div>
        
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Connect your accounts to track your development activities.
        </p>
        
        <ConnectionTabs />
      </main>
    </div>
  )
} 