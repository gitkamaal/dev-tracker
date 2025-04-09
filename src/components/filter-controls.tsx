"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FilterControlsProps {
  onSearch: (filters: FilterOptions) => void
  isLoading?: boolean
  showProjectFilter?: boolean
  showTeamFilter?: boolean
}

export interface FilterOptions {
  dateRange?: DateRange
  projectKey?: string
  teamName?: string
}

export function FilterControls({ 
  onSearch, 
  isLoading = false,
  showProjectFilter = false,
  showTeamFilter = false
}: FilterControlsProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
  const [projectKey, setProjectKey] = React.useState<string>('')
  const [teamName, setTeamName] = React.useState<string>('')
  
  const handleSearch = () => {
    console.log("Filter button clicked, applying filters:", { dateRange, projectKey, teamName });
    onSearch({
      dateRange,
      projectKey: projectKey.trim() || undefined,
      teamName: teamName.trim() || undefined
    })
  }
  
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              <span>Date Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Date Range</h4>
              <DateRangePicker 
                dateRange={dateRange} 
                onDateRangeChange={setDateRange} 
              />
            </div>
          </PopoverContent>
        </Popover>
        
        {showProjectFilter && (
          <div className="flex-1 min-w-[200px]">
            <Input 
              placeholder="Project Key (e.g. PROJ)" 
              value={projectKey}
              onChange={(e) => setProjectKey(e.target.value)}
            />
          </div>
        )}
        
        {showTeamFilter && (
          <div className="flex-1 min-w-[200px]">
            <Input 
              placeholder="Team Name" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
        )}
        
        <Button 
          onClick={handleSearch} 
          disabled={isLoading}
          className="flex gap-2"
        >
          <Search className="h-4 w-4" />
          <span>{isLoading ? "Loading..." : "Apply Filter"}</span>
        </Button>
      </div>
      
      {/* Show active filters */}
      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
        {dateRange && (
          <div>
            <span className="font-medium">Date Range:</span> {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString() || 'Present'}
          </div>
        )}
        
        {projectKey && (
          <div>
            <span className="font-medium">Project:</span> {projectKey}
          </div>
        )}
        
        {teamName && (
          <div>
            <span className="font-medium">Team:</span> {teamName}
          </div>
        )}
      </div>
    </div>
  )
}