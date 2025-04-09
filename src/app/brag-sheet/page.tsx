import { Navbar } from "@/components/navbar"
import { BragSheetList } from "@/components/brag-sheet-list"
import { BragSheetGenerator } from "@/components/brag-sheet-generator"

export default function BragSheetPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Brag Sheets</h2>
        </div>
        
        <p className="text-muted-foreground mb-10 max-w-3xl text-lg leading-relaxed">
          Track and showcase your professional accomplishments with brag sheets.
          These documents help you prepare for performance reviews and highlight your contributions.
        </p>
        
        {/* Moved BragSheetGenerator to appear first */}
        <div id="generator" className="mb-10">
          <BragSheetGenerator />
        </div>
        
        {/* Moved BragSheetList below the generator */}
        <BragSheetList />
        
      </main>
    </div>
  )
}