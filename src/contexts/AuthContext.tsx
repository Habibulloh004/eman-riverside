"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authApi } from "@/lib/api/auth";
import { apiClient } from "@/lib/api/client";

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

  const checkAuth = useCallback(async () => {
    try {
      // Try to get saved token
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        apiClient.setToken(savedToken);
        const user = await authApi.me();
        setUsername(user.username);
        setIsAuthenticated(true);
      } else {
        // Try refresh token
        try {
          const response = await authApi.refresh();
          apiClient.setToken(response.token);
          localStorage.setItem("token", response.token);
          const user = await authApi.me();
          setUsername(user.username);
          setIsAuthenticated(true);
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
      } catch {
        localStorage.removeItem("token");
        apiClient.setToken(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (usernameInput: string, password: string) => {
    const response = await authApi.login({ username: usernameInput, password });
    apiClient.setToken(response.token);
    localStorage.setItem("token", response.token);
    setUsername(usernameInput);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    }
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
