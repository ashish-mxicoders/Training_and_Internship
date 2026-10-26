// =====================================================================
// Database Connection File
// This file connects our Next.js application to Neon PostgreSQL using 'pg' Pool.
// We are NOT using any ORM (like Prisma or Drizzle) - only clean, raw SQL queries.
// =====================================================================

import { Pool } from 'pg';

// We create a global variable to keep a single pool instance during development
// to avoid creating multiple connections on Next.js hot reloads.
declare global {
  // eslint-disable-next-line no-var
  var __dbPool: Pool | undefined;
}

// Connection string from environment variable (.env)
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_zOpgH5WMEyT4@ep-old-cake-b4f4asqj-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

// Create or reuse existing pool
export const pool: Pool =
  global.__dbPool ||
  new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Required for Neon PostgreSQL SSL connection
    },
    max: 10, // Maximum active connections in pool
    idleTimeoutMillis: 30000,
  });

if (process.env.NODE_ENV !== 'production') {
  global.__dbPool = pool;
}

/**
 * Helper function to execute a raw SQL query with parameters.
 * Beginner-friendly wrapper so we don't have to write client connect/release everywhere.
 *
 * Example:
 * const result = await query('SELECT * FROM users WHERE email = $1', [email]);
 * console.log(result.rows);
 */
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // Log query in development for easy debugging
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Database Query]', { text, duration: `${duration}ms`, rowsCount: res.rowCount });
  }
  return res;
}
