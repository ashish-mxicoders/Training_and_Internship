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

// Connection string strictly loaded from environment variable (.env)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    '⚠️ [DATABASE] DATABASE_URL is not set in environment variables. Please check your .env file.'
  );
}

// Create or reuse existing pool
export const pool: Pool =
  global.__dbPool ||
  new Pool({
    connectionString: connectionString || '',
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
  return await pool.query(text, params);
}
