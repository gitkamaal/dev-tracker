import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Target, BookOpen, Users, MessageSquare, Lightbulb } from "lucide-react"

export default function CoreCompetenciesPage() {
  // Sample core competencies data
  const coreCompetencies = [
    {
      id: 1,
      title: "Drive Outcomes",
      icon: <Target className="h-6 w-6 text-blue-500" />,
      description: "Consistently deliver high-quality results that create value for the business and customers.",
      keyPoints: [
        "Focus on impact and results",
        "Take ownership of projects",
        "Prioritize effectively",
        "Overcome obstacles",
        "Meet commitments"
      ],
      examples: "Boilerplate example of driving outcomes. This will be replaced with actual content."
    },
    {
      id: 2,
      title: "Build Expertise",
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      description: "Continuously develop technical and domain knowledge to enhance your contributions.",
      keyPoints: [
        "Master technical skills",
        "Stay current with industry trends",
        "Share knowledge with others",
        "Apply best practices",
        "Solve complex problems"
      ],
      examples: "Boilerplate example of building expertise. This will be replaced with actual content."
    },
    {
      id: 3,
      title: "Cultivate Difference",
      icon: <Users className="h-6 w-6 text-purple-500" />,
      description: "Embrace diverse perspectives and create an inclusive environment where everyone can contribute.",
      keyPoints: [
        "Value diverse viewpoints",
        "Create inclusive environments",
        "Adapt communication styles",
        "Recognize and address bias",
        "Build diverse teams"
      ],
      examples: "Boilerplate example of cultivating difference. This will be replaced with actual content."
    },
    {
      id: 4,
      title: "Be Candid",
      icon: <MessageSquare className="h-6 w-6 text-red-500" />,
      description: "Communicate openly, honestly, and respectfully to build trust and drive better outcomes.",
      keyPoints: [
        "Provide direct feedback",
        "Speak up constructively",
        "Listen actively",
        "Address issues promptly",
        "Build psychological safety"
      ],
      examples: "Boilerplate example of being candid. This will be replaced with actual content."
    },
    {
      id: 5,
      title: "Develop Others",
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
      description: "Help colleagues grow through mentoring, coaching, and creating opportunities for development.",
      keyPoints: [
        "Mentor team members",
        "Provide growth opportunities",
        "Give constructive feedback",
        "Recognize achievements",
        "Support career development"
      ],
      examples: "Boilerplate example of developing others. This will be replaced with actual content."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Core Competencies</h2>
        </div>
        
        <p className="text-muted-foreground mb-10 max-w-3xl text-lg leading-relaxed">
          These five core competencies represent the key areas of professional development for engineers.
          Use this as a reference when documenting your achievements and planning your growth.
        </p>
        
        {/* Tabs for competencies */}
        <Tabs defaultValue={coreCompetencies[0].id.toString()} className="w-full mb-10">
          <TabsList className="flex bg-gray-100 dark:bg-gray-800 rounded-md mb-8">
            {coreCompetencies.map((competency) => (
              <TabsTrigger 
                key={competency.id} 
                value={competency.id.toString()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400"
              >
                {competency.icon}
                <span className="hidden sm:inline whitespace-nowrap">{competency.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {coreCompetencies.map((competency) => (
            <TabsContent key={competency.id} value={competency.id.toString()} className="mt-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {competency.icon}
                    <div>
                      <CardTitle className="text-xl">{competency.title}</CardTitle>
                      <CardDescription className="mt-1">{competency.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Key Components</h3>
                      <div className="flex flex-wrap gap-2">
                        {competency.keyPoints.map((point, index) => (
                          <Badge key={index} variant="outline" className="px-3 py-1">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Example Achievements</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                        <p className="text-muted-foreground">{competency.examples}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Card grid view of all competencies */}
        <h3 className="text-xl font-semibold mb-6">All Competencies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreCompetencies.map((competency) => (
            <Card key={competency.id} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {competency.icon}
                  <CardTitle>{competency.title}</CardTitle>
                </div>
                <CardDescription>{competency.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="text-sm font-medium mb-2">Key Components:</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {competency.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
} 