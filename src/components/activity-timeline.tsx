"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitPullRequest, CheckCircle2, Clock, GitCommit, FileText } from "lucide-react"
import { useState } from "react"

// Mock data for demonstration
const mockActivities = [
  {
    id: '1',
    type: 'pull_request',
    title: 'Pull Request Merged',
    description: 'Fixed authentication bug in user service',
    platform: 'GitHub',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    competency: 'Build Expertise',
    icon: <GitPullRequest className="h-4 w-4" />,
    color: 'bg-blue-500'
  },
  {
    id: '2',
    type: 'jira',
    title: 'Jira Ticket Resolved',
    description: 'Implemented new feature for dashboard analytics',
    platform: 'Jira',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    competency: 'Drive Outcomes',
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'bg-purple-500'
  },
  {
    id: '3',
    type: 'commit',
    title: 'Code Committed',
    description: 'Added unit tests for payment service',
    platform: 'GitHub',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    competency: 'Build Expertise',
    icon: <GitCommit className="h-4 w-4" />,
    color: 'bg-green-500'
  },
  {
    id: '4',
    type: 'confluence',
    title: 'Documentation Updated',
    description: 'Updated API documentation with new endpoints',
    platform: 'Confluence',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    competency: 'Develop Others',
    icon: <FileText className="h-4 w-4" />,
    color: 'bg-indigo-500'
  }
];

export function ActivityTimeline() {
  const [filter, setFilter] = useState('all');
  
  const filteredActivities = filter === 'all' 
    ? mockActivities 
    : mockActivities.filter(activity => activity.platform.toLowerCase() === filter.toLowerCase());
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };
  
  return (
    <Card className="border-t-4 border-t-accent">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center text-xl">
              <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription className="mt-2">Your latest contributions across all platforms</CardDescription>
          </div>
          <div className="flex space-x-2">
            <select 
              className="text-xs border rounded px-2 py-1 bg-background dark:bg-gray-800"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Platforms</option>
              <option value="github">GitHub</option>
              <option value="bitbucket">Bitbucket</option>
              <option value="jira">Jira</option>
              <option value="confluence">Confluence</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-8">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="min-w-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center text-white`}>
                    {activity.icon}
                  </div>
                  {index < filteredActivities.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 my-3"></div>
                  )}
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-5 rounded-md border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-base">{activity.title}</h4>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(activity.date)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{activity.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        activity.platform === 'GitHub' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        activity.platform === 'Bitbucket' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        activity.platform === 'Jira' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
                      }`}>
                        {activity.platform}
                      </span>
                      <span className="text-xs px-2 py-1 bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300 rounded">
                        {activity.competency}
                      </span>
                    </div>
                    <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      Add to Brag Sheet
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No activities found for the selected filter.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 