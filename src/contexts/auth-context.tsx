"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchJiraProfile } from "@/lib/atlassian";

interface AuthContextType {
  accessToken: string | null;
  jiraEmail: string | null;
  jiraApiToken: string | null;
  jiraDomain: string | null;
  loading: boolean;
  jiraLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // GitHub auth state
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Jira auth state
  const [jiraEmail, setJiraEmail] = useState<string | null>(null);
  const [jiraApiToken, setJiraApiToken] = useState<string | null>(null);
  const [jiraDomain, setJiraDomain] = useState<string | null>(null);
  const [jiraLoading, setJiraLoading] = useState(false);
  
  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Load GitHub auth
        const storedToken = localStorage.getItem('githubToken');
        if (storedToken) {
          setAccessToken(storedToken);
        }
        
        // Load Jira auth
        const storedJiraEmail = localStorage.getItem('jiraEmail');
        const storedJiraApiToken = localStorage.getItem('jiraApiToken');
        const storedJiraDomain = localStorage.getItem('jiraDomain');
        
        if (storedJiraEmail && storedJiraApiToken && storedJiraDomain) {
          setJiraEmail(storedJiraEmail);
          setJiraApiToken(storedJiraApiToken);
          setJiraDomain(storedJiraDomain);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  const value = {
    accessToken,
    jiraEmail,
    jiraApiToken,
    jiraDomain,
    loading,
    jiraLoading,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}