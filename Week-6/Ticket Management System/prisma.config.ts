// ==============================================================================
// PRISMA 7 CONFIGURATION FILE (prisma.config.ts)
// ==============================================================================
// In Prisma 7, connection URLs for CLI tools (Migrate, db push, Studio)
// are configured in this file rather than inside schema.prisma.
// ==============================================================================

import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
