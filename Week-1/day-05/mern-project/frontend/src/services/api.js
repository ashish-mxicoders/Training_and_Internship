// API Helper Service
// This file centralizes all HTTP requests to our Node/Express backend.
// We use simple fetch() calls with clear comments so you can easily
// convert this to TypeScript with typed request & response interfaces later!

const API_BASE_URL = "http://localhost:5000/api";

// Helper function to handle standard JSON fetch responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    // If the server responded with an error status (400, 401, 500, etc.)
    throw new Error(data.message || "Something went wrong with the request");
  }
  return data;
};

// ==========================================
// AUTHENTICATION API CALLS
// ==========================================

// Register a new user
export const registerUser = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
};

// Login an existing user
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

// Fetch current user details with JWT token
export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// ==========================================
// TASK MANAGEMENT API CALLS
// ==========================================

// Get all tasks with optional filters (status, priority, search)
export const fetchTasks = async (token, { status = "all", priority = "all", search = "" } = {}) => {
  const queryParams = new URLSearchParams();

  if (status && status !== "all") queryParams.append("status", status);
  if (priority && priority !== "all") queryParams.append("priority", priority);
  if (search && search.trim() !== "") queryParams.append("search", search.trim());

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/tasks${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Create a new task
export const createTask = async (token, taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  return handleResponse(response);
};

// Update an existing task
export const updateTask = async (token, taskId, taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  return handleResponse(response);
};

// Toggle task completed state
export const toggleTaskStatus = async (token, taskId) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/toggle`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Delete a task by ID
export const deleteTask = async (token, taskId) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};
