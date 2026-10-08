/**
 * ============================================================================
 * TYPE DEFINITIONS (TypeScript)
 * ============================================================================
 * Strong typing ensures code reliability and eliminates runtime type errors.
 * These interfaces and types form the backbone of our Component Architecture.
 */

// 1. Task Priority Type (Union Literal)
export type TaskPriority = 'low' | 'medium' | 'high';

// 2. Filter Status Type
export type FilterStatus = 'all' | 'pending' | 'completed';

// 3. Main Task Model
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  isCompleted: boolean;
  createdAt: string;
}

// 4. Form Data for Task Creation
export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
}

// 5. Theme Type for Context API
export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}
