// =====================================================================
// Centralized Common Application Types & Action Responses
// =====================================================================

export interface CategoryItem {
  id: string;
  name: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar?: string;
  role: string;
}

/**
 * Standard Result envelope returned by Next.js Server Actions and API endpoints
 */
export interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

