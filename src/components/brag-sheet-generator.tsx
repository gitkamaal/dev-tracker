"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { FileText, Calendar, Download, Eye } from "lucide-react"
import { useState } from "react"

export function BragSheetGenerator() {
  const [selectedCompetencies, setSelectedCompetencies] = useState({
    beCandid: false,
    buildExpertise: true,
    cultivateDifference: false,
    driveOutcomes: true,
    developOthers: false
  });
  
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  const [format, setFormat] = useState("pdf");
  const [showPreview, setShowPreview] = useState(false);
  
  const toggleCompetency = (competency: keyof typeof selectedCompetencies) => {
    setSelectedCompetencies(prev => ({
      ...prev,
      [competency]: !prev[competency]
    }));
  };
  
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  return (
    <Card className="border-t-4 border-t-accent">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <CardTitle>Brag Sheet Generator</CardTitle>
        </div>
        <CardDescription>Create your performance review materials</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Select Competencies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="be-candid" 
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                  checked={selectedCompetencies.beCandid}
                  onChange={() => toggleCompetency('beCandid')}
                />
                <label htmlFor="be-candid" className="text-sm">Be Candid</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="build-expertise" 
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                  checked={selectedCompetencies.buildExpertise}
                  onChange={() => toggleCompetency('buildExpertise')}
                />
                <label htmlFor="build-expertise" className="text-sm">Build Expertise</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="cultivate-difference" 
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                  checked={selectedCompetencies.cultivateDifference}
                  onChange={() => toggleCompetency('cultivateDifference')}
                />
                <label htmlFor="cultivate-difference" className="text-sm">Cultivate Difference</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="drive-outcomes" 
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                  checked={selectedCompetencies.driveOutcomes}
                  onChange={() => toggleCompetency('driveOutcomes')}
                />
                <label htmlFor="drive-outcomes" className="text-sm">Drive Outcomes</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="develop-others" 
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                  checked={selectedCompetencies.developOthers}
                  onChange={() => toggleCompetency('developOthers')}
                />
                <label htmlFor="develop-others" className="text-sm">Develop Others</label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-primary-600 dark:text-primary-400" />
              Date Range
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-date" className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Start Date</label>
                <input 
                  type="date" 
                  id="start-date" 
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm bg-white dark:bg-gray-800"
                  value={dateRange.start}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="end-date" className="text-xs text-gray-500 dark:text-gray-400 block mb-1">End Date</label>
                <input 
                  type="date" 
                  id="end-date" 
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm bg-white dark:bg-gray-800"
                  value={dateRange.end}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Output Format</h3>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="format-pdf" 
                  name="format" 
                  value="pdf"
                  checked={format === "pdf"}
                  onChange={() => setFormat("pdf")}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                <label htmlFor="format-pdf" className="ml-2 text-sm">PDF</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="format-word" 
                  name="format" 
                  value="word"
                  checked={format === "word"}
                  onChange={() => setFormat("word")}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                <label htmlFor="format-word" className="ml-2 text-sm">Word</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="format-markdown" 
                  name="format" 
                  value="markdown"
                  checked={format === "markdown"}
                  onChange={() => setFormat("markdown")}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                <label htmlFor="format-markdown" className="ml-2 text-sm">Markdown</label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto flex items-center space-x-2"
          onClick={() => setShowPreview(true)}
        >
          <Eye className="h-4 w-4" />
          <span>Preview</span>
        </Button>
        <Button 
          className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Generate Brag Sheet</span>
        </Button>
      </CardFooter>
      
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold">Brag Sheet Preview</h2>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Performance Review: {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}</h3>
              
              {selectedCompetencies.buildExpertise && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">Build Expertise</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Implemented new authentication flow in the user service</li>
                    <li>Fixed critical bug in payment processing system</li>
                    <li>Contributed to 24 GitHub pull requests</li>
                  </ul>
                </div>
              )}
              
              {selectedCompetencies.driveOutcomes && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">Drive Outcomes</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Led the dashboard analytics project to completion</li>
                    <li>Resolved 32 Jira tickets across multiple projects</li>
                    <li>Improved system performance by 15%</li>
                  </ul>
                </div>
              )}
              
              {selectedCompetencies.beCandid && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">Be Candid</h4>
                  <p className="text-gray-500 dark:text-gray-400 italic">No contributions found for this competency in the selected date range.</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(false)}
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
} 