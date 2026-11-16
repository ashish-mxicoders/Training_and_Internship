// =====================================================================
// API Route: /api/auth/logout
// Method: POST
// Clears the auth_token cookie to log out the user.
// =====================================================================

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  // Clear cookie by setting expiration to the past
  response.cookies.set('auth_token', '', {
    path: '/',
    maxAge: 0,
  });

  return response;
}
