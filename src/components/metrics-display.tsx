import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MetricsDisplay() {
  return (
    <Card className="border-t-4 border-t-accent">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Contribution Metrics</CardTitle>
        <CardDescription className="mt-2">Overview of your work impact</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-primary-600">24</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">GitHub Contributions</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-primary-600">18</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bitbucket Contributions</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-primary-600">32</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Jira Tickets</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-primary-600">15</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Confluence Pages</div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Build Expertise</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">65%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Drive Outcomes</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">78%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: "78%" }}></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Develop Others</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">42%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: "42%" }}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 