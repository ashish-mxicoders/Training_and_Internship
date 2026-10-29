// =====================================================================
// Centralized Auth & User Types
// =====================================================================

export type UserRole = 'admin' | 'customer';

export interface AuthUserPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  avatar?: string;
  initials?: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  initials: string;
  company?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password?: string;
  company?: string;
  role?: UserRole;
}

