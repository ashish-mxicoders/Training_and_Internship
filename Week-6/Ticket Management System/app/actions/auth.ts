'use server';

// =====================================================================
// Next.js Server Actions: Authentication (Login, Signup, Logout)
// Powered by Modern Prisma 7 ORM
// =====================================================================

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
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

    // Query User using Prisma ORM
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.trim(),
          mode: 'insensitive',
        },
      },
    });

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Create JWT
    const token = signAuthToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'admin' | 'customer',
      company: user.company || undefined,
      avatar: user.avatar || undefined,
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
      role: user.role as 'admin' | 'customer',
      avatar: user.avatar || undefined,
      initials: user.initials,
      company: user.company || undefined,
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

    // Check if email is already registered using Prisma ORM
    const existing = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.trim(),
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    if (existing) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Generate User ID and Initials
    const userId = `${role === 'admin' ? 'usr' : 'cust'}-${Date.now().toString().slice(-6)}`;
    const initials =
      name
        .trim()
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'US';

    // Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert new user with Prisma ORM (modern camelCase field names)
    const createdUser = await prisma.user.create({
      data: {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: passwordHash,
        role: role as 'admin' | 'customer',
        initials,
        company: company?.trim() || null,
      },
    });

    // Sign JWT token
    const token = signAuthToken({
      userId: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role as 'admin' | 'customer',
      company: createdUser.company || undefined,
      initials: createdUser.initials,
    });

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    const appUser: AppUser = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role as 'admin' | 'customer',
      initials: createdUser.initials,
      company: createdUser.company || undefined,
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
