import { Navbar } from "@/components/navbar"
import { AccountConnections } from "@/components/account-connections"

export default function ConnectionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">External Connections</h2>
        </div>
        
        <p className="text-muted-foreground mb-10 max-w-3xl text-lg leading-relaxed">
          Connect your external accounts to track your development activities and contributions.
          This will help you generate comprehensive brag sheets for performance reviews.
        </p>
        
        <AccountConnections />
      </main>
    </div>
  )
} 