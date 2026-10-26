// =====================================================================
// API Route: /api/auth/signup
// Method: POST
// Handles new user registration with Role selection: 'customer' or 'admin'.
// Hashes password with bcryptjs and creates user in PostgreSQL.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db/db';
import { signAuthToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, company } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Role must be 'admin' or 'customer', default to 'customer'
    const userRole: 'admin' | 'customer' =
      role === 'admin' ? 'admin' : 'customer';

    // Check if email already registered
    const existing = await query(
      `SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1;`,
      [email.trim()]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate initials (e.g. "John Doe" -> "JD")
    const initials = name
      .trim()
      .split(' ')
      .map((part: string) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'US';

    // Generate custom ID
    const userId = `${userRole === 'admin' ? 'usr' : 'cust'}-${Date.now().toString().slice(-6)}`;

    // Insert user into PostgreSQL users table
    await query(
      `
      INSERT INTO users (id, name, email, password_hash, role, initials, company, tier)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `,
      [
        userId,
        name.trim(),
        email.trim().toLowerCase(),
        passwordHash,
        userRole,
        initials,
        company ? company.trim() : (userRole === 'admin' ? 'Acme Support' : 'Client Organization'),
        'Enterprise',
      ]
    );

    // Create JWT token
    const token = signAuthToken({
      userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: userRole,
      company: company || '',
      initials,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: userRole,
        initials,
        company: company || '',
      },
    });

    // Set auth cookie
    response.cookies.set('auth_token', token, {
      httpOnly: false,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
