import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mockCookiesGet = vi.fn();

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: mockCookiesGet,
  })),
}));

import { getSessionUser, signAuthToken, verifyAuthToken } from '@/lib/auth';

describe('auth helper unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const payload = {
    userId: 'usr-1',
    name: 'Jason Duong',
    email: 'jason.duong@acme.io',
    role: 'admin' as const,
    initials: 'JD',
  };

  it('signs and verifies a valid JWT payload', () => {
    const token = signAuthToken(payload);
    expect(typeof token).toBe('string');

    const verified = verifyAuthToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe('usr-1');
    expect(verified?.email).toBe('jason.duong@acme.io');
    expect(verified?.role).toBe('admin');
  });

  it('returns null for tampered or invalid tokens', () => {
    expect(verifyAuthToken('not-a-valid-jwt')).toBeNull();
    const token = signAuthToken(payload);
    expect(verifyAuthToken(`${token}tampered`)).toBeNull();
  });

  it('extracts session user from Authorization Bearer header', async () => {
    const token = signAuthToken(payload);
    const req = new NextRequest('http://localhost:3000/api/tickets', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const user = await getSessionUser(req);
    expect(user?.userId).toBe('usr-1');
    expect(mockCookiesGet).not.toHaveBeenCalled();
  });

  it('falls back to auth_token cookie when Authorization header is absent', async () => {
    const token = signAuthToken(payload);
    mockCookiesGet.mockReturnValue({ value: token });

    const req = new NextRequest('http://localhost:3000/api/tickets');
    const user = await getSessionUser(req);

    expect(user?.email).toBe('jason.duong@acme.io');
    expect(mockCookiesGet).toHaveBeenCalledWith('auth_token');
  });

  it('returns null when neither header nor cookie contains a valid token', async () => {
    mockCookiesGet.mockReturnValue(undefined);
    const req = new NextRequest('http://localhost:3000/api/tickets');
    const user = await getSessionUser(req);
    expect(user).toBeNull();
  });
});
