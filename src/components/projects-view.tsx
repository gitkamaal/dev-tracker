import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectsView() {
  return (
    <Card className="border-t-4 border-t-accent">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Project Portfolio</CardTitle>
        <CardDescription className="mt-2">Your contributions organized by project</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Example project items */}
          <div className="border rounded-lg p-5 shadow-sm hover:shadow transition-shadow dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-lg">User Authentication Service</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Backend authentication system</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-3 py-1.5 rounded-full font-medium">Active</span>
            </div>
            <div className="mt-5 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400 mr-6">12 contributions</span>
              <span className="text-gray-500 dark:text-gray-400">Last activity: 2 days ago</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full">Build Expertise</span>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full">Drive Outcomes</span>
            </div>
          </div>
          
          <div className="border rounded-lg p-5 shadow-sm hover:shadow transition-shadow dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-lg">Dashboard Analytics</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">User metrics visualization</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1.5 rounded-full font-medium">Completed</span>
            </div>
            <div className="mt-5 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400 mr-6">8 contributions</span>
              <span className="text-gray-500 dark:text-gray-400">Last activity: 2 weeks ago</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full">Cultivate Difference</span>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full">Drive Outcomes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 