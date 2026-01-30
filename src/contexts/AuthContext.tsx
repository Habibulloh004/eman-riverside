"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { authApi } from "@/lib/api/auth";
import { apiClient } from "@/lib/api/client";

// Refresh token every 20 minutes to keep session alive
const REFRESH_INTERVAL_MS = 20 * 60 * 1000;

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const silentRefresh = useCallback(async () => {
    try {
      const response = await authApi.refresh();
      apiClient.setToken(response.token);
      localStorage.setItem("token", response.token);
    } catch {
      // Refresh failed silently — the 401 interceptor in client.ts
      // will handle it on the next API call
    }
  }, []);

  const startRefreshInterval = useCallback(() => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    refreshIntervalRef.current = setInterval(silentRefresh, REFRESH_INTERVAL_MS);
  }, [silentRefresh]);

  const stopRefreshInterval = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      // Try to get saved token
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        apiClient.setToken(savedToken);
        const user = await authApi.me();
        setUsername(user.username);
        setIsAuthenticated(true);
        startRefreshInterval();
      } else {
        // Try refresh token
        try {
          const response = await authApi.refresh();
          apiClient.setToken(response.token);
          localStorage.setItem("token", response.token);
          const user = await authApi.me();
          setUsername(user.username);
          setIsAuthenticated(true);
          startRefreshInterval();
        } catch {
          // No valid session
          setIsAuthenticated(false);
        }
      }
    } catch {
      // Token invalid, try refresh
      try {
        const response = await authApi.refresh();
        apiClient.setToken(response.token);
        localStorage.setItem("token", response.token);
        const user = await authApi.me();
        setUsername(user.username);
        setIsAuthenticated(true);
        startRefreshInterval();
      } catch {
        localStorage.removeItem("token");
        apiClient.setToken(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [startRefreshInterval]);

  useEffect(() => {
    checkAuth();
    return () => stopRefreshInterval();
  }, [checkAuth, stopRefreshInterval]);

  // Refresh token when tab becomes visible again (e.g. user returns after a while)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isAuthenticated) {
        silentRefresh();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isAuthenticated, silentRefresh]);

  const login = async (usernameInput: string, password: string) => {
    const response = await authApi.login({ username: usernameInput, password });
    apiClient.setToken(response.token);
    localStorage.setItem("token", response.token);
    setUsername(usernameInput);
    setIsAuthenticated(true);
    startRefreshInterval();
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    }
    stopRefreshInterval();
    localStorage.removeItem("token");
    apiClient.setToken(null);
    setUsername(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
