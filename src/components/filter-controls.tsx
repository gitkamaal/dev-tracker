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

interface FilterControlsProps {
  onSearch: (filters: FilterOptions) => void
  isLoading?: boolean
}

export interface FilterOptions {
  dateRange?: DateRange
}

export function FilterControls({ onSearch, isLoading = false }: FilterControlsProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
  
  const handleSearch = () => {
    console.log("Filter button clicked, applying filters:", { dateRange });
    onSearch({
      dateRange
    })
  }
  
  return (
    <div className="flex justify-end gap-2 mb-4">
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
      
      <Button 
        onClick={handleSearch} 
        disabled={isLoading}
        className="flex gap-2"
      >
        <Search className="h-4 w-4" />
        <span>{isLoading ? "Loading..." : "Apply Filter"}</span>
      </Button>
    </div>
  )
} 