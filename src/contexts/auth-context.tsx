"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile as fetchGitHubProfile } from "@/lib/github";
import { fetchUserProfile as fetchJiraProfile, fetchAccessibleResources } from "@/lib/jira";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  accessToken: string | null;
  setGitHubToken: (token: string) => void;
  logout: () => void;
  loading: boolean;
  isJiraAuthenticated: boolean;
  jiraUser: any | null;
  jiraAccessToken: string | null;
  jiraCloudId: string | null;
  setJiraToken: (token: string) => void;
  logoutJira: () => void;
  jiraLoading: boolean;
}

const defaultContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  setGitHubToken: () => {},
  logout: () => {},
  loading: true,
  isJiraAuthenticated: false,
  jiraUser: null,
  jiraAccessToken: null,
  jiraCloudId: null,
  setJiraToken: () => {},
  logoutJira: () => {},
  jiraLoading: true,
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isJiraAuthenticated, setIsJiraAuthenticated] = useState(false);
  const [jiraUser, setJiraUser] = useState<any | null>(null);
  const [jiraAccessToken, setJiraAccessToken] = useState<string | null>(null);
  const [jiraCloudId, setJiraCloudId] = useState<string | null>(null);
  const [jiraLoading, setJiraLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    checkJiraAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("github_token");
      if (token) {
        setAccessToken(token);
        try {
          const profile = await fetchGitHubProfile(token);
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Error fetching GitHub profile:", error);
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
      const token = localStorage.getItem("jira_token");
      const cloudId = localStorage.getItem("jira_cloud_id");
      
      if (token) {
        setJiraAccessToken(token);
        
        try {
          // Fetch user profile
          const profile = await fetchJiraProfile(token);
          
          // If we don't have a cloud ID yet, try to get one
          let currentCloudId = cloudId;
          if (!currentCloudId) {
            const resources = await fetchAccessibleResources(token);
            if (resources && resources.length > 0) {
              currentCloudId = resources[0].id;
              localStorage.setItem("jira_cloud_id", currentCloudId);
              setJiraCloudId(currentCloudId);
            }
          } else {
            setJiraCloudId(currentCloudId);
          }
          
          if (profile) {
            setJiraUser(profile);
            setIsJiraAuthenticated(true);
          }
        } catch (error) {
          console.error("Error fetching Jira profile:", error);
          localStorage.removeItem("jira_token");
          localStorage.removeItem("jira_cloud_id");
          setIsJiraAuthenticated(false);
          setJiraUser(null);
          setJiraAccessToken(null);
          setJiraCloudId(null);
        }
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

  const setJiraToken = (token: string) => {
    localStorage.setItem("jira_token", token);
    setJiraAccessToken(token);
    updateJiraAuthState();
  };

  const logoutJira = () => {
    localStorage.removeItem("jira_token");
    localStorage.removeItem("jira_cloud_id");
    setIsJiraAuthenticated(false);
    setJiraUser(null);
    setJiraAccessToken(null);
    setJiraCloudId(null);
  };

  const updateAuthState = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("github_token");
      if (token) {
        const profile = await fetchGitHubProfile(token);
        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);
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

  const updateJiraAuthState = async () => {
    try {
      setJiraLoading(true);
      const token = localStorage.getItem("jira_token");
      if (token) {
        // Fetch user profile
        const profile = await fetchJiraProfile(token);
        
        // Get cloud ID if we don't have one
        const resources = await fetchAccessibleResources(token);
        if (resources && resources.length > 0) {
          const cloudId = resources[0].id;
          localStorage.setItem("jira_cloud_id", cloudId);
          setJiraCloudId(cloudId);
        }
        
        if (profile) {
          setJiraUser(profile);
          setIsJiraAuthenticated(true);
        }
      } else {
        setIsJiraAuthenticated(false);
        setJiraUser(null);
        setJiraCloudId(null);
      }
    } catch (error) {
      console.error("Error updating Jira auth state:", error);
      setIsJiraAuthenticated(false);
      setJiraUser(null);
      setJiraCloudId(null);
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
        jiraAccessToken,
        jiraCloudId,
        setJiraToken,
        logoutJira,
        jiraLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 