'use server';

// =====================================================================
// Next.js Server Actions: Authentication (Login, Signup, Logout)
// Uses 'use server' to execute securely on the server runtime.
// Automatically manages session cookies using `next/headers`.
// =====================================================================

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { query } from '@/lib/db/db';
import { signAuthToken } from '@/lib/auth';
import { ActionResponse, AppUser, LoginCredentials, SignupCredentials } from '@/types';

/**
 * Server Action: Authenticate user & set session cookie
 */
export async function loginAction(
  credentials: LoginCredentials
): Promise<ActionResponse<AppUser>> {
  try {
    const { email, password } = credentials;

    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    // Query Neon PostgreSQL
    const result = await query(
      `SELECT id, name, email, password_hash, role, avatar, initials, company
       FROM users
       WHERE LOWER(email) = LOWER($1)
       LIMIT 1;`,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return { success: false, error: 'Invalid email or password' };
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Create JWT
    const token = signAuthToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      avatar: user.avatar,
      initials: user.initials,
    });

    // Set cookie using Next.js Server Action cookie API
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'lax',
    });

    const appUser: AppUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      initials: user.initials,
      company: user.company,
    };

    return {
      success: true,
      message: 'Login successful',
      data: appUser,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Create new user account, sign JWT, and set cookie
 */
export async function signupAction(
  data: SignupCredentials
): Promise<ActionResponse<AppUser>> {
  try {
    const { name, email, password, company, role = 'customer' } = data;

    if (!name || !email || !password) {
      return { success: false, error: 'Name, email, and password are required' };
    }

    // Check if email is already registered
    const existing = await query(
      `SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1;`,
      [email.trim()]
    );

    if (existing.rows.length > 0) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Generate User ID and Initials
    const userId = `usr-${Date.now().toString().slice(-6)}`;
    const initials = name
      .trim()
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'US';

    // Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert new user into Neon PostgreSQL
    await query(
      `
      INSERT INTO users (id, name, email, password_hash, role, initials, company, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW());
      `,
      [
        userId,
        name.trim(),
        email.trim().toLowerCase(),
        passwordHash,
        role,
        initials,
        company?.trim() || null,
      ]
    );

    // Sign JWT token
    const token = signAuthToken({
      userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      company: company?.trim(),
      initials,
    });

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    const appUser: AppUser = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      initials,
      company: company?.trim(),
    };

    return {
      success: true,
      message: 'Account created successfully',
      data: appUser,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Logout user by expiring the auth_token cookie
 */
export async function logoutAction(): Promise<ActionResponse<void>> {
  try {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', '', {
      path: '/',
      maxAge: 0,
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Logout failed';
    return { success: false, error: message };
  }
}

