import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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