import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockQueryRaw } = vi.hoisted(() => ({
  mockQueryRaw: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    $queryRaw: mockQueryRaw,
  },
}));

import { GET } from '@/app/api/health/route';

describe('GET /api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 OK when PostgreSQL responds', async () => {
    mockQueryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(body.database).toBe('connected');
    expect(typeof body.timestamp).toBe('string');
  });

  it('returns 503 Service Unavailable when PostgreSQL is unreachable', async () => {
    mockQueryRaw.mockRejectedValueOnce(new Error('Connection refused'));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.status).toBe('error');
    expect(body.database).toBe('disconnected');
    expect(body.error).toBe('Connection refused');
  });
});
