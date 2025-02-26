import {
  GitlabIcon as GitHub,
  GithubIcon as Bitbucket,
  Trello,
  Book
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AccountConnections() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Connect Your Accounts</CardTitle>
        <CardDescription>Link your external accounts to start tracking your accomplishments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center space-y-2">
            <GitHub size={24} />
            <span>GitHub</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center space-y-2">
            <Bitbucket size={24} />
            <span>Bitbucket</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center space-y-2">
            <Trello size={24} />
            <span>Jira</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center space-y-2">
            <Book size={24} />
            <span>Confluence</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 