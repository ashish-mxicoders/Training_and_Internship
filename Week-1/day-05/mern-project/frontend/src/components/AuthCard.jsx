// AuthCard Component
// Handles user Login and Registration with tabs, validation, and demo autofill.

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthCard() {
  const { login, register } = useAuth();

  // Mode: "login" or "register"
  const [mode, setMode] = useState("login");

  // Form input state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Local state for feedback and loading
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle generic input changes
  const handleChange = (e) => {
    setErrorMessage("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        if (!formData.email || !formData.password) {
          setErrorMessage("Please enter both email and password");
          setIsLoading(false);
          return;
        }

        const res = await login(formData.email, formData.password);
        if (!res.success) {
          setErrorMessage(res.message);
        }
      } else {
        // Register mode
        if (!formData.name || !formData.email || !formData.password) {
          setErrorMessage("Please fill all required fields");
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setErrorMessage("Password must be at least 6 characters long");
          setIsLoading(false);
          return;
        }

        const res = await register(formData.name, formData.email, formData.password);
        if (!res.success) {
          setErrorMessage(res.message);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for demo/testing
  const handleQuickDemoFill = () => {
    setFormData({
      name: "Ashish Kumar",
      email: "ashish.demo@company.com",
      password: "password123",
    });
    setErrorMessage("");
  };

  return (
    <div className="w-full max-w-md mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200/80 dark:border-zinc-800 transition-all">
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3 border border-indigo-100 dark:border-indigo-900/40">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {mode === "login" ? "Welcome Back" : "Create an Account"}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {mode === "login"
            ? "Sign in to manage your tasks efficiently"
            : "Sign up to start organizing your daily workflow"}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErrorMessage("");
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-xl transition cursor-pointer ${
            mode === "login"
              ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setErrorMessage("");
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-xl transition cursor-pointer ${
            mode === "register"
              ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          Register
        </button>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm flex items-start space-x-2">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ashish Patel"
              required={mode === "register"}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
          />
          {mode === "register" && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              Minimum 6 characters
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2 cursor-pointer"
        >
          {isLoading && (
            <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          <span>
            {isLoading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </span>
        </button>
      </form>

      {/* Quick Demo Helper */}
      <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <button
          type="button"
          onClick={handleQuickDemoFill}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
        >
          ⚡ Autofill Demo Credentials
        </button>
      </div>
    </div>
  );
}
