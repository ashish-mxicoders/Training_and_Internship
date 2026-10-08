// Authentication Context & Provider (TypeScript)
// Manages authentication state, token storage, and user profile with full type safety.

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "../types";
import { loginUser, registerUser, getCurrentUser } from "../services/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token") || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const logout = (): void => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    setError(null);
  };

  useEffect(() => {
    const verifyStoredToken = async (): Promise<void> => {
      const storedToken = localStorage.getItem("auth_token");
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser(storedToken);
        if (response.success && response.user) {
          setUser(response.user);
          setToken(storedToken);
        } else {
          logout();
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Token verification failed";
        console.error("Token verification failed:", message);
        localStorage.removeItem("auth_token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyStoredToken();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    setError(null);
    try {
      const response = await loginUser(email, password);
      if (response.success && response.token && response.user) {
        localStorage.setItem("auth_token", response.token);
        setToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: response.message || "Login failed" };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login error";
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    setError(null);
    try {
      const response = await registerUser(name, email, password);
      if (response.success && response.token && response.user) {
        localStorage.setItem("auth_token", response.token);
        setToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: response.message || "Registration failed" };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration error";
      setError(message);
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        error,
        setError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
