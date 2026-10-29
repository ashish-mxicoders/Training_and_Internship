// =====================================================================
// API Route: /api/auth/me
// Method: GET
// Returns the currently authenticated user based on session token.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query } from '@/lib/db/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    // Refresh fresh user data from database
    const result = await query(
      `SELECT id, name, email, role, avatar, initials, company, tier
       FROM users
       WHERE id = $1
       LIMIT 1;`,
      [session.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: result.rows[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Authentication verification failed';
    return NextResponse.json(
      { authenticated: false, error: message },
      { status: 500 }
    );
  }
}
