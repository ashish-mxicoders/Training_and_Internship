// =====================================================================
// Database Connection & ORM File (Prisma + Neon PostgreSQL)
// =====================================================================
// In Week 6, we have transitioned the project to use Prisma ORM!
// Primary database operations are performed via `prisma` (from `@/lib/prisma`).
// This file re-exports Prisma and retains a pool fallback for raw queries.
// =====================================================================

import { Pool, QueryResult, QueryResultRow } from 'pg';
import prisma from '../prisma';

export { prisma };

declare global {
  // eslint-disable-next-line no-var
  var __dbPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

export const pool: Pool =
  global.__dbPool ||
  new Pool({
    connectionString: connectionString || '',
    ssl: {
      rejectUnauthorized: false,
    },
    max: 10,
    idleTimeoutMillis: 30000,
  });

if (process.env.NODE_ENV !== 'production') {
  global.__dbPool = pool;
}

export async function query<R extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<R>> {
  return await pool.query<R>(text, params);
}

export default prisma;
