"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Calendar, Star, StarOff } from "lucide-react"
import { useState } from "react"

// Mock data for demonstration
const mockBragSheets = [
  {
    id: '1',
    title: 'Q2 2023 Performance Review',
    dateCreated: new Date(2023, 5, 15),
    dateRange: { start: new Date(2023, 0, 1), end: new Date(2023, 5, 30) },
    competencies: ['Build Expertise', 'Drive Outcomes'],
    starred: true
  },
  {
    id: '2',
    title: 'Mid-Year Review 2023',
    dateCreated: new Date(2023, 6, 10),
    dateRange: { start: new Date(2023, 0, 1), end: new Date(2023, 5, 30) },
    competencies: ['Build Expertise', 'Develop Others', 'Be Candid'],
    starred: false
  },
  {
    id: '3',
    title: 'End of Year Review 2023',
    dateCreated: new Date(2023, 11, 20),
    dateRange: { start: new Date(2023, 6, 1), end: new Date(2023, 11, 31) },
    competencies: ['Drive Outcomes', 'Cultivate Difference'],
    starred: true
  }
];

export function BragSheetList() {
  const [bragSheets, setBragSheets] = useState(mockBragSheets);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  
  const toggleStar = (id: string) => {
    setBragSheets(prev => 
      prev.map(sheet => 
        sheet.id === id ? { ...sheet, starred: !sheet.starred } : sheet
      )
    );
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <Card className="mb-8 border-t-4 border-t-red-600">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center">
              <FileText className="h-5 w-5 text-red-600 mr-2" />
              Your Brag Sheets
            </CardTitle>
            <CardDescription className="mt-2 text-sm">
              View and manage your generated performance review materials
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="text-sm"
            onClick={() => window.location.href = '#generator'}
          >
            Create New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {bragSheets.length > 0 ? (
          <div className="space-y-4">
            {bragSheets.map(sheet => (
              <div key={sheet.id} className="border rounded-md p-4 hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg flex items-center">
                      {sheet.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {formatDate(sheet.dateRange.start)} - {formatDate(sheet.dateRange.end)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleStar(sheet.id)}
                    title={sheet.starred ? "Unstar" : "Star"}
                  >
                    {sheet.starred ? (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {sheet.competencies.map(comp => (
                    <span key={comp} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded">
                      {comp}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Created: {formatDate(sheet.dateCreated)}
                  </span>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs flex items-center"
                      onClick={() => setShowPreview(sheet.id)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No brag sheets yet</h3>
            <p className="mb-4">Generate your first brag sheet to see it here.</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '#generator'}
            >
              Create Brag Sheet
            </Button>
          </div>
        )}
      </CardContent>
      
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {bragSheets.find(s => s.id === showPreview)?.title}
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowPreview(null)}
              >
                Close
              </Button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                Performance Review: {formatDate(bragSheets.find(s => s.id === showPreview)?.dateRange.start as Date)} - 
                {formatDate(bragSheets.find(s => s.id === showPreview)?.dateRange.end as Date)}
              </h3>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-red-600 mb-2">Build Expertise</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Implemented new authentication flow in the user service</li>
                  <li>Fixed critical bug in payment processing system</li>
                  <li>Contributed to 24 GitHub pull requests</li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-red-600 mb-2">Drive Outcomes</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Led the dashboard analytics project to completion</li>
                  <li>Resolved 32 Jira tickets across multiple projects</li>
                  <li>Improved system performance by 15%</li>
                </ul>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
} 