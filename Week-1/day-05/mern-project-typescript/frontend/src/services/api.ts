// API Service (TypeScript)
// Centralized, strictly typed HTTP client using native fetch() for backend communication.

import {
  AuthResponse,
  CurrentUserResponse,
  TasksResponse,
  SingleTaskResponse,
  DeleteTaskResponse,
  FilterParams,
  TaskFormData,
} from "../types";

const API_BASE_URL = "http://localhost:5000/api";

// Helper function to handle standard JSON fetch responses with generic type safety
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = (await response.json()) as T & { message?: string };
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong with the request");
  }
  return data;
};

// ==========================================
// AUTHENTICATION API CALLS
// ==========================================

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse<AuthResponse>(response);
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(response);
};

export const getCurrentUser = async (token: string): Promise<CurrentUserResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<CurrentUserResponse>(response);
};

// ==========================================
// TASK MANAGEMENT API CALLS
// ==========================================

export const fetchTasks = async (
  token: string,
  { status = "all", priority = "all", search = "" }: FilterParams = {}
): Promise<TasksResponse> => {
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
  return handleResponse<TasksResponse>(response);
};

export const createTask = async (
  token: string,
  taskData: TaskFormData
): Promise<SingleTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  return handleResponse<SingleTaskResponse>(response);
};

export const updateTask = async (
  token: string,
  taskId: string,
  taskData: Partial<TaskFormData & { isCompleted?: boolean }>
): Promise<SingleTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  return handleResponse<SingleTaskResponse>(response);
};

export const toggleTaskStatus = async (
  token: string,
  taskId: string
): Promise<SingleTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/toggle`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<SingleTaskResponse>(response);
};

export const deleteTask = async (
  token: string,
  taskId: string
): Promise<DeleteTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<DeleteTaskResponse>(response);
};
