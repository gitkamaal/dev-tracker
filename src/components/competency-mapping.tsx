import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CompetencyMapping() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Competency Mapping</CardTitle>
        <CardDescription>Your strengths across core competencies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold">78%</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Drive Outcomes</h4>
              <p className="text-sm text-gray-500">Your strongest competency</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold">65%</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Build Expertise</h4>
              <p className="text-sm text-gray-500">Technical contributions</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold">42%</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Develop Others</h4>
              <p className="text-sm text-gray-500">Mentoring and knowledge sharing</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: "42%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 