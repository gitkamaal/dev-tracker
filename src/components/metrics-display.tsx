import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MetricsDisplay() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution Metrics</CardTitle>
        <CardDescription>Overview of your work impact</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-gray-500">GitHub Contributions</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold">18</div>
            <div className="text-sm text-gray-500">Bitbucket Contributions</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold">32</div>
            <div className="text-sm text-gray-500">Jira Tickets</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-gray-500">Confluence Pages</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Build Expertise</span>
              <span className="text-sm text-gray-500">65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: "65%" }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Drive Outcomes</span>
              <span className="text-sm text-gray-500">78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: "78%" }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Develop Others</span>
              <span className="text-sm text-gray-500">42%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: "42%" }}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 