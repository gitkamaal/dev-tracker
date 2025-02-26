import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CompetencyMapping() {
  return (
    <Card className="border-t-4 border-t-accent">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Competency Mapping</CardTitle>
        <CardDescription className="mt-2">Your strengths across core competencies</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-300 font-bold text-xl">78%</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-lg">Drive Outcomes</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Your strongest competency</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-3">
                <div className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-300 font-bold text-xl">65%</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-lg">Build Expertise</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Technical contributions</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-3">
                <div className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-300 font-bold text-xl">42%</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-lg">Develop Others</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Mentoring and knowledge sharing</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-3">
                <div className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full" style={{ width: "42%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 