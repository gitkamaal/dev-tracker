import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectsView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Portfolio</CardTitle>
        <CardDescription>Your contributions organized by project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Example project items */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">User Authentication Service</h4>
                <p className="text-sm text-gray-500 mt-1">Backend authentication system</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 mr-4">12 contributions</span>
              <span className="text-gray-500">Last activity: 2 days ago</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Build Expertise</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Drive Outcomes</span>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Dashboard Analytics</h4>
                <p className="text-sm text-gray-500 mt-1">User metrics visualization</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Completed</span>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 mr-4">8 contributions</span>
              <span className="text-gray-500">Last activity: 2 weeks ago</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Cultivate Difference</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Drive Outcomes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 