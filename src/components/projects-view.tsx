"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch, Star, Eye, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

type Repository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

export function ProjectsView() {
  const { isAuthenticated, accessToken, user } = useAuth();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRepositories = async () => {
      if (!isAuthenticated || !accessToken) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=6', {
          headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }

        const data = await response.json();
        setRepositories(data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [isAuthenticated, accessToken]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Projects</CardTitle>
        <CardDescription>Your GitHub repositories</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            Loading repositories...
          </div>
        ) : !isAuthenticated ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            Connect your GitHub account to see your repositories
          </div>
        ) : repositories.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No repositories found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repositories.map((repo) => (
              <a 
                key={repo.id} 
                href={repo.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 border rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
              >
                <h3 className="font-medium text-base mb-1 truncate">{repo.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 h-10 overflow-hidden">
                  {repo.description || 'No description available'}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    {repo.language && (
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-primary-500 mr-1"></span>
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center">
                      <GitBranch className="h-3 w-3 mr-1" />
                      {repo.forks_count}
                    </span>
                  </div>
                  <span className="flex items-center text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(repo.updated_at)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 