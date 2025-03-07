"use client"

import * as React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    
    // Always show first page
    pages.push(1)
    
    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1)
    let endPage = Math.min(totalPages - 1, currentPage + 1)
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push(-1) // -1 represents ellipsis
    }
    
    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push(-2) // -2 represents ellipsis
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    
    return pages
  }
  
  // Don't render pagination if there's only one page or less
  if (totalPages <= 1) {
    console.log("Not showing pagination - only one page or less:", { totalPages });
    return null;
  }
  
  console.log("Showing pagination:", { currentPage, totalPages });
  
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        
        {getPageNumbers().map((page, index) => (
          <PaginationItem key={`page-${page}-${index}`}>
            {page < 0 ? (
              <span className="flex h-9 w-9 items-center justify-center">...</span>
            ) : (
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
} 