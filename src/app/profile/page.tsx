"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Calendar, GitBranch, Code, Star, Award, FileText, Clock, Shield } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [compactView, setCompactView] = useState(false);
  
  // Hydration fix - only render theme UI after mount
  useEffect(() => {
    setMounted(true);
    
    // Load font size and compact view from localStorage
    const storedFontSize = localStorage.getItem("fontSize");
    const storedCompactView = localStorage.getItem("compactView");
    
    if (storedFontSize) setFontSize(storedFontSize);
    if (storedCompactView) setCompactView(storedCompactView === "true");
  }, []);
  
  // Update document with font size and compact view changes
  useEffect(() => {
    if (!mounted) return;
    
    // Save to localStorage
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("compactView", String(compactView));
    
    // Update document classes
    const root = document.documentElement;
    
    // Handle font size
    root.classList.remove("text-sm", "text-base", "text-lg");
    if (fontSize === "small") root.classList.add("text-sm");
    else if (fontSize === "large") root.classList.add("text-lg");
    else root.classList.add("text-base");
    
    // Handle compact view
    if (compactView) {
      root.classList.add("compact");
    } else {
      root.classList.remove("compact");
    }
  }, [fontSize, compactView, mounted]);
  
  // Account settings state
  const [accountInfo, setAccountInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    title: "Senior Software Engineer",
    team: "Platform Engineering"
  });
  
  const handleAccountChange = (field: keyof typeof accountInfo, value: string) => {
    setAccountInfo(prev => ({ ...prev, [field]: value }));
  };
  
  const saveAccountChanges = () => {
    // In a real app, this would save to a backend
    alert("Account changes saved!");
  };
  
  // Check if we should show the account tab based on URL hash
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#account') {
        const accountTab = document.querySelector('[data-value="account"]') as HTMLElement;
        if (accountTab) {
          accountTab.click();
        }
      }
    }
  }, [mounted]);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto p-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-shrink-0 flex flex-col items-center">
              <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-lg">
                <AvatarFallback className="text-4xl bg-red-600 text-white">JD</AvatarFallback>
              </Avatar>
              <Button variant="outline" className="mt-4 w-full">Edit Profile</Button>
            </div>
            
            <div className="flex-grow">
              <h1 className="text-3xl font-bold mb-2">John Doe</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Senior Software Engineer at Acme Inc.</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100">
                  <Code className="h-3 w-3 mr-1" />
                  Frontend
                </Badge>
                <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100">
                  <Code className="h-3 w-3 mr-1" />
                  React
                </Badge>
                <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100">
                  <Code className="h-3 w-3 mr-1" />
                  TypeScript
                </Badge>
                <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100">
                  <Code className="h-3 w-3 mr-1" />
                  Next.js
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">42</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">PRs Merged</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">128</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Commits</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">15</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Projects</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">8</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Brag Sheets</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="flex w-full bg-gray-100 dark:bg-gray-800 rounded-md p-1 mb-8">
              <TabsTrigger value="overview" className="flex-1 flex items-center justify-center gap-2">
                <User className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1 flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex-1 flex items-center justify-center gap-2">
                <Award className="h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="bragsheets" className="flex-1 flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                Brag Sheets
              </TabsTrigger>
              <TabsTrigger value="account" data-value="account" className="flex-1 flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" />
                Account
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Passionate software engineer with 5+ years of experience in frontend development.
                      Specialized in building responsive and accessible web applications using React and TypeScript.
                      Currently focused on improving developer experience and application performance.
                    </p>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-medium">Full Name</h4>
                          <p className="text-gray-600 dark:text-gray-400">John Doe</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-medium">Joined</h4>
                          <p className="text-gray-600 dark:text-gray-400">January 15, 2022</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <GitBranch className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-medium">Team</h4>
                          <p className="text-gray-600 dark:text-gray-400">Platform Engineering</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Competencies</CardTitle>
                    <CardDescription>Your strongest areas based on activity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Build Expertise</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-red-600 dark:bg-red-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Drive Outcomes</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-red-600 dark:bg-red-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Be Candid</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">78%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-red-600 dark:bg-red-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Develop Others</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">72%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-red-600 dark:bg-red-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View All Competencies</Button>
                  </CardFooter>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>Milestones you've reached recently</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 flex items-center space-x-4">
                      <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                        <Star className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">100+ Commits</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Reached 100 commits milestone</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex items-center space-x-4">
                      <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                        <Award className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Top Contributor</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Most active in Q2 2023</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex items-center space-x-4">
                      <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                        <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Documentation Hero</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Improved project documentation</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Achievements</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your development activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="border-l-2 border-red-200 pl-4 ml-4 relative">
                      <div className="absolute w-3 h-3 bg-red-600 rounded-full -left-[7px] top-1"></div>
                      <h4 className="font-medium">Merged Pull Request</h4>
                      <p className="text-sm text-gray-600 mb-1">Added new authentication flow to user service</p>
                      <p className="text-xs text-gray-500">Today at 10:30 AM</p>
                    </div>
                    
                    <div className="border-l-2 border-red-200 pl-4 ml-4 relative">
                      <div className="absolute w-3 h-3 bg-red-600 rounded-full -left-[7px] top-1"></div>
                      <h4 className="font-medium">Created Issue</h4>
                      <p className="text-sm text-gray-600 mb-1">Performance optimization for dashboard components</p>
                      <p className="text-xs text-gray-500">Yesterday at 3:45 PM</p>
                    </div>
                    
                    <div className="border-l-2 border-red-200 pl-4 ml-4 relative">
                      <div className="absolute w-3 h-3 bg-red-600 rounded-full -left-[7px] top-1"></div>
                      <h4 className="font-medium">Commented on Issue</h4>
                      <p className="text-sm text-gray-600 mb-1">Provided solution for API integration bug</p>
                      <p className="text-xs text-gray-500">2 days ago at 11:20 AM</p>
                    </div>
                    
                    <div className="border-l-2 border-red-200 pl-4 ml-4 relative">
                      <div className="absolute w-3 h-3 bg-red-600 rounded-full -left-[7px] top-1"></div>
                      <h4 className="font-medium">Reviewed Pull Request</h4>
                      <p className="text-sm text-gray-600 mb-1">Code review for payment processing feature</p>
                      <p className="text-xs text-gray-500">3 days ago at 2:15 PM</p>
                    </div>
                    
                    <div className="border-l-2 border-red-200 pl-4 ml-4 relative">
                      <div className="absolute w-3 h-3 bg-red-600 rounded-full -left-[7px] top-1"></div>
                      <h4 className="font-medium">Deployed to Production</h4>
                      <p className="text-sm text-gray-600 mb-1">Released v2.3.0 with new features</p>
                      <p className="text-xs text-gray-500">1 week ago at 9:00 AM</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Full Activity Log</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Earned Badges</CardTitle>
                    <CardDescription>Recognition for your accomplishments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 text-center">
                        <div className="bg-red-100 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-3">
                          <Star className="h-8 w-8 text-red-600" />
                        </div>
                        <h4 className="font-medium">Code Master</h4>
                        <p className="text-xs text-gray-500">100+ commits</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 text-center">
                        <div className="bg-red-100 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-3">
                          <Award className="h-8 w-8 text-red-600" />
                        </div>
                        <h4 className="font-medium">Top Contributor</h4>
                        <p className="text-xs text-gray-500">Most active developer</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 text-center">
                        <div className="bg-red-100 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-3">
                          <FileText className="h-8 w-8 text-red-600" />
                        </div>
                        <h4 className="font-medium">Documentation Hero</h4>
                        <p className="text-xs text-gray-500">Improved documentation</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 text-center">
                        <div className="bg-red-100 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-3">
                          <GitBranch className="h-8 w-8 text-red-600" />
                        </div>
                        <h4 className="font-medium">Branch Manager</h4>
                        <p className="text-xs text-gray-500">Created 20+ branches</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Progress Towards Next Badge</CardTitle>
                    <CardDescription>Keep up the good work!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Code className="h-5 w-5 text-red-600 mr-2" />
                            <span className="font-medium">Bug Squasher</span>
                          </div>
                          <span className="text-sm text-gray-500">18/25</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Fix 25 bugs to earn this badge</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <GitBranch className="h-5 w-5 text-red-600 mr-2" />
                            <span className="font-medium">PR Champion</span>
                          </div>
                          <span className="text-sm text-gray-500">42/50</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{ width: "84%" }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Complete 50 pull requests to earn this badge</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Award className="h-5 w-5 text-red-600 mr-2" />
                            <span className="font-medium">Code Reviewer</span>
                          </div>
                          <span className="text-sm text-gray-500">12/30</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Review 30 pull requests to earn this badge</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="bragsheets">
              <Card>
                <CardHeader>
                  <CardTitle>Your Brag Sheets</CardTitle>
                  <CardDescription>Performance review materials you've generated</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4 hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">Q2 2023 Performance Review</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Jan 1, 2023 - Jun 30, 2023</span>
                          </div>
                        </div>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded">Build Expertise</span>
                        <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded">Drive Outcomes</span>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Created: Jun 15, 2023</span>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 text-xs">Preview</Button>
                          <Button variant="ghost" size="sm" className="h-8 text-xs text-red-600">Download</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">Mid-Year Review 2023</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Jan 1, 2023 - Jun 30, 2023</span>
                          </div>
                        </div>
                        <Star className="h-4 w-4 text-gray-300" />
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded">Build Expertise</span>
                        <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded">Develop Others</span>
                        <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded">Be Candid</span>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Created: Jul 10, 2023</span>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 text-xs">Preview</Button>
                          <Button variant="ghost" size="sm" className="h-8 text-xs text-red-600">Download</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">View All Brag Sheets</Button>
                  <Button>Create New Brag Sheet</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <div className="max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your account details and personal information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          placeholder="Your name" 
                          value={accountInfo.name}
                          onChange={(e) => handleAccountChange("name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Your email" 
                          value={accountInfo.email}
                          onChange={(e) => handleAccountChange("email", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input 
                        id="title" 
                        placeholder="Your job title" 
                        value={accountInfo.title}
                        onChange={(e) => handleAccountChange("title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="team">Team</Label>
                      <Input 
                        id="team" 
                        placeholder="Your team" 
                        value={accountInfo.team}
                        onChange={(e) => handleAccountChange("team", e.target.value)}
                      />
                    </div>
                    <Button className="mt-2" onClick={saveAccountChanges}>Save Changes</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
} 