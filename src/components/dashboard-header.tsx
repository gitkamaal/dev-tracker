import { BarChart2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <BarChart2 size={16} />
          <span>Dashboard</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <FileText size={16} />
          <span>Brag Sheets</span>
        </Button>
      </div>
    </div>
  )
} 