"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function AuthError() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-6">Authentication Error</h1>
          
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-6 rounded-lg mb-8">
            <p>There was a problem authenticating with GitHub. Please try again.</p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <Link href="/connections">
              <Button className="w-full">Return to Connections</Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 