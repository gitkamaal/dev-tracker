"use client";

import { BarChart2, FileText, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState, useEffect } from "react"

export function DashboardHeader() {
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  
  // Check local storage on component mount
  useEffect(() => {
    const hasClosedWelcomeMessage = localStorage.getItem("hasClosedWelcomeMessage");
    if (hasClosedWelcomeMessage === "true") {
      setShowWelcomeMessage(false);
    }
  }, []);
  
  // Handle closing the welcome message
  const handleCloseWelcomeMessage = () => {
    localStorage.setItem("hasClosedWelcomeMessage", "true");
    setShowWelcomeMessage(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
      </div>
      
      {showWelcomeMessage && (
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 relative pr-10">
          <Info className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          <AlertTitle>Welcome to Dev Tracker</AlertTitle>
          <AlertDescription>
            To view your development activity, first connect to your accounts in the Connections page, 
            then use the filters in each tab to display your data. Data will only appear after applying filters.
          </AlertDescription>
          <button 
            type="button"
            className="absolute top-3 right-3 p-1
                      text-gray-600 dark:text-gray-300 
                      hover:text-gray-900 dark:hover:text-white
                      focus:outline-none"
            onClick={handleCloseWelcomeMessage}
            aria-label="Close welcome message"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </Alert>
      )}
    </div>
  )
} 