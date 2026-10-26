// =====================================================================
// API Route: /api/users
// Method: GET
// Returns all admin users who can be assigned to support tickets.
// =====================================================================

import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db';

export async function GET() {
  try {
    const res = await query(
      `SELECT id, name, email, role, avatar, initials, company, tier
       FROM users
       WHERE role = 'admin'
       ORDER BY name ASC;`
    );
    return NextResponse.json({ users: res.rows });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
