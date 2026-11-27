import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      include: [
        'lib/auth.ts',
        'lib/ticket-filters.ts',
        'app/api/health/route.ts',
        'app/api/auth/**/*.ts',
        'app/api/tickets/**/*.ts',
        'app/api/categories/route.ts',
        'app/api/users/route.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
