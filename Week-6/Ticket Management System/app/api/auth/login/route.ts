// =====================================================================
// API Route: /api/auth/login
// Method: POST
// Handles user login for both Customer and Admin roles via Modern Prisma 7 ORM.
// Checks password with bcryptjs and sets an HTTP-only JWT cookie.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signAuthToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Step 1: Look up user in Neon PostgreSQL users table via Prisma
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.trim(),
          mode: 'insensitive',
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Step 2: Compare password using bcryptjs
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Step 3: Create JWT token with user info
    const token = signAuthToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'admin' | 'customer',
      company: user.company || undefined,
      avatar: user.avatar || undefined,
      initials: user.initials,
    });

    // Step 4: Return user data and set cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        initials: user.initials,
        company: user.company,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
