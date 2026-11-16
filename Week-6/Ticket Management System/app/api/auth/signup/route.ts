// =====================================================================
// API Route: /api/auth/signup
// Method: POST
// Handles new user registration with Role selection: 'customer' or 'admin'.
// Powered by Modern Prisma 7 ORM.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
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

    const userRole: 'admin' | 'customer' =
      role === 'admin' ? 'admin' : 'customer';

    // Check if email already registered via Prisma
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
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate initials (e.g. "John Doe" -> "JD")
    const initials =
      name
        .trim()
        .split(' ')
        .map((part: string) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'US';

    const userId = `${userRole === 'admin' ? 'usr' : 'cust'}-${Date.now().toString().slice(-6)}`;

    // Create user in PostgreSQL via Prisma with modern camelCase fields
    const user = await prisma.user.create({
      data: {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: passwordHash,
        role: userRole,
        initials,
        company: company?.trim() || null,
      },
    });

    // Create JWT token
    const token = signAuthToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'admin' | 'customer',
      company: user.company || undefined,
      avatar: user.avatar || undefined,
      initials: user.initials,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          initials: user.initials,
          company: user.company,
        },
      },
      { status: 201 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
