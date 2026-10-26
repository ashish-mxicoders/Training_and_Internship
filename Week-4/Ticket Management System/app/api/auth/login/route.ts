// =====================================================================
// API Route: /api/auth/login
// Method: POST
// Handles user login for both Customer and Admin roles.
// Checks password with bcryptjs and sets an HTTP-only JWT cookie.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db/db';
import { signAuthToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validation: make sure email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Step 1: Look up user in Neon PostgreSQL users table
    const result = await query(
      `SELECT id, name, email, password_hash, role, avatar, initials, company, tier
       FROM users
       WHERE LOWER(email) = LOWER($1)
       LIMIT 1;`,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Step 2: Compare password using bcryptjs
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
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
      role: user.role,
      company: user.company,
      avatar: user.avatar,
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
        tier: user.tier,
      },
    });

    // Set auth cookie
    response.cookies.set('auth_token', token, {
      httpOnly: false, // Accessible to client-side code for easy token reading
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during login' },
      { status: 500 }
    );
  }
}
