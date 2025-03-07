"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile as fetchGitHubUser } from "@/lib/github";
import { fetchJiraProfile } from "@/lib/atlassian";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  accessToken: string | null;
  setGitHubToken: (token: string) => void;
  logout: () => void;
  loading: boolean;
  isJiraAuthenticated: boolean;
  jiraUser: any | null;
  jiraEmail: string | null;
  jiraApiToken: string | null;
  jiraDomain: string | null;
  setJiraCredentials: (email: string, apiToken: string, domain: string) => void;
  logoutJira: () => void;
  jiraLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isJiraAuthenticated, setIsJiraAuthenticated] = useState(false);
  const [jiraUser, setJiraUser] = useState<any | null>(null);
  const [jiraEmail, setJiraEmail] = useState<string | null>(null);
  const [jiraApiToken, setJiraApiToken] = useState<string | null>(null);
  const [jiraDomain, setJiraDomain] = useState<string | null>(null);
  const [jiraLoading, setJiraLoading] = useState(true);

  useEffect(() => {
    updateAuthState();
    checkJiraAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("github_token");
      
      if (token) {
        setAccessToken(token);
        
        try {
          const userData = await fetchGitHubUser(token);
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Error fetching GitHub user:", error);
          localStorage.removeItem("github_token");
          setIsAuthenticated(false);
          setUser(null);
          setAccessToken(null);
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkJiraAuth = async () => {
    try {
      const email = localStorage.getItem("jira_email");
      const apiToken = localStorage.getItem("jira_api_token");
      const domain = localStorage.getItem("jira_domain");
      
      console.log("Checking Jira auth with email:", email ? "Email exists" : "No email");
      console.log("Checking Jira auth with API token:", apiToken ? "Token exists" : "No token");
      console.log("Checking Jira auth with domain:", domain);
      
      if (email && apiToken && domain) {
        setJiraEmail(email);
        setJiraApiToken(apiToken);
        setJiraDomain(domain);
        
        try {
          console.log("Attempting to fetch Jira profile...");
          // Fetch Jira profile using Basic Auth
          const profile = await fetchJiraProfile(email, apiToken, domain);
          
          console.log("Jira profile fetch result:", profile ? "Success" : "Failed");
          
          if (profile) {
            setJiraUser(profile);
            setIsJiraAuthenticated(true);
            console.log("Jira authentication successful");
          }
        } catch (error) {
          console.error("Error fetching Jira profile:", error);
          localStorage.removeItem("jira_email");
          localStorage.removeItem("jira_api_token");
          localStorage.removeItem("jira_domain");
          setIsJiraAuthenticated(false);
          setJiraUser(null);
          setJiraEmail(null);
          setJiraApiToken(null);
          setJiraDomain(null);
        }
      } else {
        console.log("No Jira credentials found in localStorage");
      }
    } catch (error) {
      console.error("Jira auth check error:", error);
    } finally {
      setJiraLoading(false);
    }
  };

  const setGitHubToken = (token: string) => {
    localStorage.setItem("github_token", token);
    setAccessToken(token);
    updateAuthState();
  };

  const logout = () => {
    localStorage.removeItem("github_token");
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
  };

  const setJiraCredentials = (email: string, apiToken: string, domain: string) => {
    console.log("Setting Jira credentials...");
    console.log("Email:", email);
    console.log("Domain:", domain);
    
    localStorage.setItem("jira_email", email);
    localStorage.setItem("jira_api_token", apiToken);
    localStorage.setItem("jira_domain", domain);
    
    updateJiraAuthState(email, apiToken, domain);
  };

  const logoutJira = () => {
    localStorage.removeItem("jira_email");
    localStorage.removeItem("jira_api_token");
    localStorage.removeItem("jira_domain");
    setIsJiraAuthenticated(false);
    setJiraUser(null);
    setJiraEmail(null);
    setJiraApiToken(null);
    setJiraDomain(null);
  };

  const updateAuthState = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("github_token");
      
      if (token) {
        try {
          const userData = await fetchGitHubUser(token);
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Error fetching GitHub user:", error);
          localStorage.removeItem("github_token");
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error updating auth state:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateJiraAuthState = async (email: string, apiToken: string, domain: string) => {
    try {
      setJiraLoading(true);
      console.log("Updating Jira auth state...");
      console.log("Email:", email);
      console.log("Domain:", domain);
      
      // Set the credentials in state
      setJiraEmail(email);
      setJiraApiToken(apiToken);
      setJiraDomain(domain);
      
      // Fetch Jira profile using Basic Auth
      console.log("Fetching Jira profile in updateJiraAuthState...");
      const profile = await fetchJiraProfile(email, apiToken, domain);
      
      console.log("Profile fetch result:", profile ? "Success" : "Failed");
      
      if (profile) {
        setJiraUser(profile);
        setIsJiraAuthenticated(true);
        console.log("Jira authentication successful in updateJiraAuthState");
      } else {
        console.error("No profile returned from Jira API");
        setIsJiraAuthenticated(false);
        setJiraUser(null);
      }
    } catch (error) {
      console.error("Error updating Jira auth state:", error);
      setIsJiraAuthenticated(false);
      setJiraUser(null);
      
      // Don't clear the credentials here, as we want to keep them for debugging
    } finally {
      setJiraLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        setGitHubToken,
        logout,
        loading,
        isJiraAuthenticated,
        jiraUser,
        jiraEmail,
        jiraApiToken,
        jiraDomain,
        setJiraCredentials,
        logoutJira,
        jiraLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 