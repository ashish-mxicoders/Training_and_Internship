// ==============================================================================
// PRISMA 7 CLIENT SINGLETON WITH PG DRIVER ADAPTER
// ==============================================================================
// Prisma 7 introduces mandatory Driver Adapters for direct database connections.
// Here we integrate `pg.Pool` with `@prisma/adapter-pg` and `PrismaClient`.
// Global caching prevents connection exhaustion during Next.js fast refresh.
// ==============================================================================

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL || '';

// Enable SSL automatically for cloud databases (e.g., Neon), disable for local Docker/CI Postgres
const shouldUseSsl =
  !connectionString.includes('sslmode=disable') &&
  (connectionString.includes('sslmode=require') ||
    connectionString.includes('neon.tech'));

export const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    ...(shouldUseSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    max: 10,
    idleTimeoutMillis: 30000,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;
