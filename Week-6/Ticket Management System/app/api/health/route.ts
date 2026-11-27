// =====================================================================
// API Route: /api/health
// Method: GET
// Used by Docker HEALTHCHECK, load balancers, and CI/CD smoke tests
// to verify that both the Next.js server and PostgreSQL are healthy.
// =====================================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Database connection failed';

    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
