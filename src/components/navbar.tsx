"use client"

import { User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

export function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  
  return (
    <nav className="bg-red-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <span className="text-red-600 font-bold text-lg">DT</span>
          </div>
          <h1 className="text-2xl font-bold">Dev Tracker</h1>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-white hover:text-white/80 transition-colors">
            Dashboard
          </Link>
          <Link href="/brag-sheet" className="text-white hover:text-white/80 transition-colors">
            Brag Sheets
          </Link>
          <Link href="/connections" className="text-white hover:text-white/80 transition-colors">
            Connections
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <div className="relative">
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 hover:bg-white/10 transition-colors text-white"
              aria-label="Profile"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <User className="h-5 w-5 text-red-600" />
              </div>
            </Button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Profile
                </Link>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-700"
                  onClick={() => {
                    // Logout functionality would go here
                    console.log("Logout clicked");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/10 transition-colors text-white">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
} 