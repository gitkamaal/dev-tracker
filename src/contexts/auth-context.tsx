"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
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
  validateGitHubToken: () => Promise<boolean>;
  validateJiraCredentials: () => Promise<boolean>;
  validateBitbucketCredentials: () => Promise<boolean>;
  bitbucketToken: string | null;
  setBitbucketToken: (token: string) => void;
  logoutBitbucket: () => void;
  isBitbucketAuthenticated: boolean;
  bitbucketLoading: boolean;
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

  // Add cache timestamps to prevent excessive API calls
  const lastGitHubValidation = useRef<number>(0);
  const lastJiraValidation = useRef<number>(0);
  // Cache validity period (5 minutes in milliseconds)
  const CACHE_VALIDITY = 5 * 60 * 1000;

  // Add cache timestamp for Bitbucket validation
  const lastBitbucketValidation = useRef<number>(0);

  // Add Bitbucket state
  const [isBitbucketAuthenticated, setIsBitbucketAuthenticated] = useState(false);
  const [bitbucketToken, setBitbucketTokenState] = useState<string | null>(null);
  const [bitbucketLoading, setBitbucketLoading] = useState(true);

  useEffect(() => {
    updateAuthState();
    checkJiraAuth();
    checkBitbucketAuth();
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
      const now = Date.now();
      
      // If we've validated recently and are authenticated, skip the check
      if (now - lastJiraValidation.current < CACHE_VALIDITY && isJiraAuthenticated) {
        console.log("Skipping Jira auth check due to recent validation");
        setJiraLoading(false);
        return;
      }
      
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
            // Update the validation timestamp
            lastJiraValidation.current = now;
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

  const checkBitbucketAuth = async () => {
    try {
      const now = Date.now();
      
      // If we've validated recently and are authenticated, skip the check
      if (now - lastBitbucketValidation.current < CACHE_VALIDITY && isBitbucketAuthenticated) {
        console.log("Skipping Bitbucket auth check due to recent validation");
        setBitbucketLoading(false);
        return;
      }
      
      const token = localStorage.getItem("bitbucket_token");
      
      console.log("Checking Bitbucket auth with token:", token ? "Token exists" : "No token");
      
      if (token) {
        setBitbucketTokenState(token);
        
        try {
          console.log("Attempting to validate Bitbucket token...");
          // Fetch Bitbucket workspaces to validate token
          const { fetchBitbucketWorkspaces } = await import('@/lib/atlassian');
          
          console.log("Calling fetchBitbucketWorkspaces with token");
          const workspaces = await fetchBitbucketWorkspaces(token);
          
          console.log("Bitbucket token validation result:", workspaces ? "Success" : "Failed");
          console.log("Workspaces data:", workspaces);
          
          if (workspaces && workspaces.values) {
            setIsBitbucketAuthenticated(true);
            console.log("Bitbucket authentication successful");
            // Update the validation timestamp
            lastBitbucketValidation.current = now;
          } else {
            console.error("No workspaces found in Bitbucket response");
            localStorage.removeItem("bitbucket_token");
            setIsBitbucketAuthenticated(false);
            setBitbucketTokenState(null);
          }
        } catch (error) {
          console.error("Error validating Bitbucket token:", error);
          localStorage.removeItem("bitbucket_token");
          setIsBitbucketAuthenticated(false);
          setBitbucketTokenState(null);
        }
      } else {
        console.log("No Bitbucket token found in localStorage");
      }
    } catch (error) {
      console.error("Bitbucket auth check error:", error);
    } finally {
      setBitbucketLoading(false);
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
      const now = Date.now();
      
      // If we've validated recently and are authenticated, skip the update
      if (now - lastGitHubValidation.current < CACHE_VALIDITY && isAuthenticated) {
        console.log("Skipping GitHub auth update due to recent validation");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const token = localStorage.getItem("github_token");
      
      if (token) {
        try {
          const userData = await fetchGitHubUser(token);
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            // Update the validation timestamp
            lastGitHubValidation.current = now;
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

  const validateGitHubToken = async (): Promise<boolean> => {
    try {
      const now = Date.now();
      
      // If we've validated recently, return the cached result
      if (now - lastGitHubValidation.current < CACHE_VALIDITY && isAuthenticated) {
        console.log("Using cached GitHub validation result");
        return true;
      }
      
      console.log("Manually validating GitHub token...");
      setLoading(true);
      const token = localStorage.getItem("github_token");
      
      if (!token) {
        console.log("No GitHub token found in localStorage");
        setLoading(false);
        return false;
      }
      
      // Update the token in state regardless
      setAccessToken(token);
      
      try {
        console.log("Fetching GitHub user profile...");
        const userData = await fetchGitHubUser(token);
        
        if (userData) {
          console.log("GitHub user profile fetched successfully");
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);
          // Update the validation timestamp
          lastGitHubValidation.current = now;
          return true;
        } else {
          console.error("GitHub user profile fetch returned no data");
          setLoading(false);
          return false;
        }
      } catch (error) {
        console.error("Error validating GitHub token:", error);
        // Don't remove token on error, let the caller handle that decision
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Token validation error:", error);
      setLoading(false);
      return false;
    }
  };

  const validateJiraCredentials = async (): Promise<boolean> => {
    try {
      const now = Date.now();
      
      // If we've validated recently, return the cached result
      if (now - lastJiraValidation.current < CACHE_VALIDITY && isJiraAuthenticated) {
        console.log("Using cached Jira validation result");
        return true;
      }
      
      console.log("Manually validating Jira credentials...");
      setJiraLoading(true);
      const email = localStorage.getItem("jira_email");
      const apiToken = localStorage.getItem("jira_api_token");
      const domain = localStorage.getItem("jira_domain");
      
      console.log("Found credentials:", email ? "Email exists" : "No email", 
        apiToken ? "Token exists" : "No token", 
        domain ? `Domain: ${domain}` : "No domain");
      
      if (!email || !apiToken || !domain) {
        console.log("Missing Jira credentials in localStorage");
        setJiraLoading(false);
        return false;
      }
      
      // Update the state regardless
      setJiraEmail(email);
      setJiraApiToken(apiToken);
      setJiraDomain(domain);
      
      try {
        console.log("Fetching Jira profile to validate credentials...");
        const profile = await fetchJiraProfile(email, apiToken, domain);
        
        if (profile) {
          console.log("Jira profile fetch successful:", profile.displayName);
          setJiraUser(profile);
          setIsJiraAuthenticated(true);
          setJiraLoading(false);
          // Update the validation timestamp
          lastJiraValidation.current = now;
          return true;
        } else {
          console.error("Jira profile fetch returned no data");
          setJiraLoading(false);
          return false;
        }
      } catch (error) {
        console.error("Error validating Jira credentials:", error);
        // Don't remove credentials on error, let the caller handle that decision
        setJiraLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Jira credentials validation error:", error);
      setJiraLoading(false);
      return false;
    }
  };

  const validateBitbucketCredentials = async (): Promise<boolean> => {
    try {
      const now = Date.now();
      
      // If we've validated recently and are authenticated, return true
      if (now - lastBitbucketValidation.current < CACHE_VALIDITY && isBitbucketAuthenticated) {
        console.log("Skipping Bitbucket validation due to recent validation");
        return true;
      }
      
      const token = localStorage.getItem("bitbucket_token");
      
      if (!token) {
        console.log("No Bitbucket token found for validation");
        return false;
      }
      
      console.log("Validating Bitbucket token...");
      
      try {
        // Use the fetchBitbucketWorkspaces function to validate credentials
        const { fetchBitbucketWorkspaces } = await import('@/lib/atlassian');
        const workspaces = await fetchBitbucketWorkspaces(token);
        
        console.log("Bitbucket workspaces response:", workspaces);
        
        if (workspaces && workspaces.values) {
          console.log("Bitbucket validation successful");
          // Update the validation timestamp
          lastBitbucketValidation.current = now;
          setIsBitbucketAuthenticated(true);
          return true;
        }
        
        console.log("Bitbucket validation failed - no workspaces found");
        return false;
      } catch (error) {
        console.error("Error validating Bitbucket credentials:", error);
        // Clear the token if validation fails
        localStorage.removeItem("bitbucket_token");
        setBitbucketTokenState(null);
        setIsBitbucketAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error("Error in validateBitbucketCredentials:", error);
      return false;
    }
  };

  const setBitbucketToken = (token: string) => {
    console.log("Setting Bitbucket token...");
    
    if (!token) {
      console.error("No token provided to setBitbucketToken");
      return;
    }
    
    try {
      localStorage.setItem("bitbucket_token", token);
      setBitbucketTokenState(token);
      console.log("Bitbucket token set in localStorage and state");
      
      // Trigger the auth check
      checkBitbucketAuth();
    } catch (error) {
      console.error("Error setting Bitbucket token:", error);
    }
  };

  const logoutBitbucket = () => {
    localStorage.removeItem("bitbucket_token");
    setIsBitbucketAuthenticated(false);
    setBitbucketTokenState(null);
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
        jiraLoading,
        validateGitHubToken,
        validateJiraCredentials,
        validateBitbucketCredentials,
        bitbucketToken,
        setBitbucketToken,
        logoutBitbucket,
        isBitbucketAuthenticated,
        bitbucketLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 