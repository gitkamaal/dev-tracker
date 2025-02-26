import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function BragSheetGenerator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brag Sheet Generator</CardTitle>
        <CardDescription>Create your performance review materials</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Generate a comprehensive brag sheet based on your contributions across all platforms.
            The brag sheet will be organized by the five core competencies.
          </p>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="be-candid" className="mr-2" />
              <label htmlFor="be-candid" className="text-sm">Be Candid</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="build-expertise" className="mr-2" defaultChecked />
              <label htmlFor="build-expertise" className="text-sm">Build Expertise</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="cultivate-difference" className="mr-2" />
              <label htmlFor="cultivate-difference" className="text-sm">Cultivate Difference</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="drive-outcomes" className="mr-2" defaultChecked />
              <label htmlFor="drive-outcomes" className="text-sm">Drive Outcomes</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="develop-others" className="mr-2" />
              <label htmlFor="develop-others" className="text-sm">Develop Others</label>
            </div>
          </div>
          
          <Button className="w-full bg-red-600 hover:bg-red-700">Generate Brag Sheet</Button>
        </div>
      </CardContent>
    </Card>
  )
} 