// =====================================================================
// API Route: /api/auth/me
// Method: GET
// Returns the currently authenticated user based on session token.
// Powered by Prisma ORM.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    // Refresh fresh user data from database via Prisma
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        initials: true,
        company: true,
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Authentication verification failed';
    return NextResponse.json(
      { authenticated: false, error: message },
      { status: 500 }
    );
  }
}
