// =====================================================================
// Authentication Helper Module (JWT & Password Verification)
// This file handles:
// 1. Password verification with bcryptjs
// 2. JWT signing and verification
// 3. Extracting the current logged-in user from Request headers/cookies
// =====================================================================

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Secret key for signing JWT tokens strictly loaded from environment
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_fallback_secret_only';

if (!process.env.JWT_SECRET) {
  console.warn(
    '⚠️ [AUTH WARNING] JWT_SECRET is not configured in .env. Please define JWT_SECRET in your .env file.'
  );
}

export interface AuthUserPayload {
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  company?: string;
  avatar?: string;
  initials?: string;
}

/**
 * Creates a signed JWT token valid for 7 days.
 */
export function signAuthToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verifies a JWT token and returns the user payload or null if invalid.
 */
export function verifyAuthToken(token: string): AuthUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUserPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Extracts the authenticated user from cookies or Authorization header.
 * Can be used in API route handlers.
 */
export async function getSessionUser(req?: NextRequest): Promise<AuthUserPayload | null> {
  try {
    // 1. Check Authorization header first: "Bearer <token>"
    if (req) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const verified = verifyAuthToken(token);
        if (verified) return verified;
      }
    }

    // 2. Check Next.js cookies
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('auth_token');
    if (tokenCookie && tokenCookie.value) {
      const verified = verifyAuthToken(tokenCookie.value);
      if (verified) return verified;
    }

    return null;
  } catch (e) {
    return null;
  }
}
