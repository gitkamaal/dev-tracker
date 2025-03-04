"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile as fetchGitHubUserProfile, getGitHubAuthUrl } from '@/lib/github';
import { fetchUserProfile as fetchJiraUserProfile, getJiraAuthUrl } from '@/lib/jira';

// Define the shape of our authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  accessToken: string | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  isJiraAuthenticated: boolean;
  jiraUser: any | null;
  jiraAccessToken: string | null;
  jiraRefreshToken: string | null;
  loginJira: () => void;
  logoutJira: () => void;
  jiraLoading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  login: () => {},
  logout: () => {},
  loading: true,
  isJiraAuthenticated: false,
  jiraUser: null,
  jiraAccessToken: null,
  jiraRefreshToken: null,
  loginJira: () => {},
  logoutJira: () => {},
  jiraLoading: true,
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // GitHub auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Jira auth state
  const [isJiraAuthenticated, setIsJiraAuthenticated] = useState<boolean>(false);
  const [jiraUser, setJiraUser] = useState<any | null>(null);
  const [jiraAccessToken, setJiraAccessToken] = useState<string | null>(null);
  const [jiraRefreshToken, setJiraRefreshToken] = useState<string | null>(null);
  const [jiraLoading, setJiraLoading] = useState<boolean>(true);

  // Check for existing GitHub auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('github_access_token');
        
        if (storedToken) {
          setAccessToken(storedToken);
          
          // Fetch user profile to validate token
          const userProfile = await fetchGitHubUserProfile(storedToken);
          setUser(userProfile);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('GitHub authentication error:', error);
        // Clear invalid token
        localStorage.removeItem('github_access_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);
  
  // Check for existing Jira auth on mount
  useEffect(() => {
    const checkJiraAuth = async () => {
      try {
        const storedToken = localStorage.getItem('jira_access_token');
        const storedRefreshToken = localStorage.getItem('jira_refresh_token');
        
        if (storedToken && storedRefreshToken) {
          setJiraAccessToken(storedToken);
          setJiraRefreshToken(storedRefreshToken);
          
          // Fetch user profile to validate token
          const userProfile = await fetchJiraUserProfile(storedToken);
          setJiraUser(userProfile);
          setIsJiraAuthenticated(true);
        }
      } catch (error) {
        console.error('Jira authentication error:', error);
        // Clear invalid tokens
        localStorage.removeItem('jira_access_token');
        localStorage.removeItem('jira_refresh_token');
      } finally {
        setJiraLoading(false);
      }
    };

    checkJiraAuth();
  }, []);

  // Redirect to GitHub login
  const login = () => {
    const authUrl = getGitHubAuthUrl();
    window.location.href = authUrl;
  };

  // Clear GitHub auth state
  const logout = () => {
    localStorage.removeItem('github_access_token');
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
  };
  
  // Redirect to Jira login
  const loginJira = () => {
    const authUrl = getJiraAuthUrl();
    window.location.href = authUrl;
  };

  // Clear Jira auth state
  const logoutJira = () => {
    localStorage.removeItem('jira_access_token');
    localStorage.removeItem('jira_refresh_token');
    setIsJiraAuthenticated(false);
    setJiraUser(null);
    setJiraAccessToken(null);
    setJiraRefreshToken(null);
  };

  // Update GitHub auth state when token changes
  useEffect(() => {
    const updateAuthState = async () => {
      if (accessToken) {
        try {
          const userProfile = await fetchGitHubUserProfile(accessToken);
          setUser(userProfile);
          setIsAuthenticated(true);
          localStorage.setItem('github_access_token', accessToken);
        } catch (error) {
          console.error('Failed to fetch GitHub user profile:', error);
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('github_access_token');
        }
      }
    };

    if (accessToken) {
      updateAuthState();
    }
  }, [accessToken]);
  
  // Update Jira auth state when token changes
  useEffect(() => {
    const updateJiraAuthState = async () => {
      if (jiraAccessToken && jiraRefreshToken) {
        try {
          const userProfile = await fetchJiraUserProfile(jiraAccessToken);
          setJiraUser(userProfile);
          setIsJiraAuthenticated(true);
          localStorage.setItem('jira_access_token', jiraAccessToken);
          localStorage.setItem('jira_refresh_token', jiraRefreshToken);
        } catch (error) {
          console.error('Failed to fetch Jira user profile:', error);
          setIsJiraAuthenticated(false);
          setJiraUser(null);
          localStorage.removeItem('jira_access_token');
          localStorage.removeItem('jira_refresh_token');
        }
      }
    };

    if (jiraAccessToken && jiraRefreshToken) {
      updateJiraAuthState();
    }
  }, [jiraAccessToken, jiraRefreshToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        login,
        logout,
        loading,
        isJiraAuthenticated,
        jiraUser,
        jiraAccessToken,
        jiraRefreshToken,
        loginJira,
        logoutJira,
        jiraLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 