// Authentication Context & Provider
// Manages logged in user state, JWT token storage, login, register, and logout.

import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "../services/api";

// Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store authenticated user profile
  const [user, setUser] = useState(null);

  // Store JWT token string
  const [token, setToken] = useState(() => localStorage.getItem("auth_token") || null);

  // Loading state while checking token validity on initial app load
  const [isLoading, setIsLoading] = useState(true);

  // General auth error message
  const [error, setError] = useState(null);

  // Check if token exists on mount, fetch current user profile
  useEffect(() => {
    const verifyStoredToken = async () => {
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
          // Token is invalid or expired
          logout();
        }
      } catch (err) {
        console.error("Token verification failed:", err.message);
        // Clear invalid session
        localStorage.removeItem("auth_token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyStoredToken();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await loginUser(email, password);
      if (response.success && response.token) {
        // Save token to localStorage
        localStorage.setItem("auth_token", response.token);
        setToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: response.message || "Login failed" };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setError(null);
    try {
      const response = await registerUser(name, email, password);
      if (response.success && response.token) {
        localStorage.setItem("auth_token", response.token);
        setToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: response.message || "Registration failed" };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    setError(null);
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

// Custom Hook to consume Auth Context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
