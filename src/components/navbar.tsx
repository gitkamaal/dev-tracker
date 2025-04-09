"use client"

import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

export function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <nav className="bg-red-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          {/* Removed SVG Logo */}
          <h1 className="text-2xl font-bold">BragBot</h1>
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
          <Link href="/core-competencies" className="text-white hover:text-white/80 transition-colors">
            Core Competencies
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden hover:bg-white/10 transition-colors text-white"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden pt-4 pb-2 px-2">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="text-white hover:text-white/80 transition-colors py-2 px-3 rounded-md hover:bg-white/10"
              onClick={() => setShowMobileMenu(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/brag-sheet" 
              className="text-white hover:text-white/80 transition-colors py-2 px-3 rounded-md hover:bg-white/10"
              onClick={() => setShowMobileMenu(false)}
            >
              Brag Sheets
            </Link>
            <Link 
              href="/connections" 
              className="text-white hover:text-white/80 transition-colors py-2 px-3 rounded-md hover:bg-white/10"
              onClick={() => setShowMobileMenu(false)}
            >
              Connections
            </Link>
            <Link 
              href="/core-competencies" 
              className="text-white hover:text-white/80 transition-colors py-2 px-3 rounded-md hover:bg-white/10"
              onClick={() => setShowMobileMenu(false)}
            >
              Core Competencies
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}