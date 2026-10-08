// Frontend TypeScript Definitions & Interfaces
// Strictly typed data structures, component props, and API response contracts.
// Zero 'any' types used!

// ==========================================
// 1. DATA MODELS & ENUMS
// ==========================================

// Priority union type
export type Priority = "low" | "medium" | "high";

// Filter options
export type StatusFilter = "all" | "pending" | "completed";
export type PriorityFilter = "all" | Priority;

// User Profile representation
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

// Task Model representation
export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  isCompleted: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

// Task form input payload
export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
}

// ==========================================
// 2. API RESPONSES
// ==========================================

export interface BaseApiResponse {
  success: boolean;
  message?: string;
}

export interface AuthResponse extends BaseApiResponse {
  token?: string;
  user?: User;
}

export interface CurrentUserResponse extends BaseApiResponse {
  user?: User;
}

export interface TasksResponse extends BaseApiResponse {
  count?: number;
  tasks?: Task[];
}

export interface SingleTaskResponse extends BaseApiResponse {
  task: Task;
}

export interface DeleteTaskResponse extends BaseApiResponse {
  deletedTaskId?: string;
}

export interface FilterParams {
  status?: StatusFilter;
  priority?: PriorityFilter;
  search?: string;
}

// ==========================================
// 3. UI STATE & CONTEXT TYPES
// ==========================================

export interface FeedbackMessage {
  type: "success" | "error";
  message: string;
}

export interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  isDark: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}
