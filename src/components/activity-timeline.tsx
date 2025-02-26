import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest contributions across all platforms</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Timeline content goes here */}
        <div className="space-y-4">
          {/* Example timeline items */}
          <div className="flex items-start space-x-4">
            <div className="min-w-10 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <div className="w-0.5 h-full bg-gray-200"></div>
            </div>
            <div className="flex-1 bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between">
                <h4 className="font-medium">Pull Request Merged</h4>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Fixed authentication bug in user service</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">GitHub</span>
                <span className="text-xs ml-2">Build Expertise</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="min-w-10 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <div className="w-0.5 h-full bg-gray-200"></div>
            </div>
            <div className="flex-1 bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between">
                <h4 className="font-medium">Jira Ticket Resolved</h4>
                <span className="text-xs text-gray-500">1 week ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Implemented new feature for dashboard analytics</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Jira</span>
                <span className="text-xs ml-2">Drive Outcomes</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 