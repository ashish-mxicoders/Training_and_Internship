import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

const { mockFindFirst, mockFindUnique, mockCreate, mockGetSessionUser } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockFindUnique: vi.fn(),
  mockCreate: vi.fn(),
  mockGetSessionUser: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findFirst: mockFindFirst,
      findUnique: mockFindUnique,
      create: mockCreate,
    },
  },
}));

vi.mock('@/lib/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/auth')>();
  return {
    ...actual,
    getSessionUser: mockGetSessionUser,
  };
});

import { POST as loginPOST } from '@/app/api/auth/login/route';
import { POST as signupPOST } from '@/app/api/auth/signup/route';
import { GET as meGET } from '@/app/api/auth/me/route';
import { POST as logoutPOST } from '@/app/api/auth/logout/route';

describe('Auth API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('returns 400 when email or password is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@acme.io' }),
      });

      const res = await loginPOST(req);
      expect(res.status).toBe(400);
    });

    it('returns 401 when user does not exist or password mismatches', async () => {
      mockFindFirst.mockResolvedValueOnce(null);

      const reqMissingUser = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'missing@acme.io', password: 'secret' }),
      });
      expect((await loginPOST(reqMissingUser)).status).toBe(401);

      const hash = await bcrypt.hash('correct-password', 4);
      mockFindFirst.mockResolvedValueOnce({
        id: 'usr-1',
        name: 'Admin',
        email: 'admin@acme.io',
        passwordHash: hash,
        role: 'admin',
        initials: 'AD',
        avatar: null,
        company: 'Acme',
      });

      const reqWrongPass = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@acme.io', password: 'wrong' }),
      });
      expect((await loginPOST(reqWrongPass)).status).toBe(401);
    });

    it('returns 200 and sets auth_token cookie on valid credentials', async () => {
      const hash = await bcrypt.hash('123456', 4);
      mockFindFirst.mockResolvedValueOnce({
        id: 'usr-admin-main',
        name: 'Admin User',
        email: 'admin@acme.io',
        passwordHash: hash,
        role: 'admin',
        initials: 'AU',
        avatar: null,
        company: 'Acme Support',
      });

      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@acme.io', password: '123456' }),
      });

      const res = await loginPOST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.user.email).toBe('admin@acme.io');
      expect(res.cookies.get('auth_token')?.value).toBeTruthy();
    });
  });

  describe('POST /api/auth/signup', () => {
    it('returns 400 when required fields are missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email: 'new@client.com' }),
      });
      expect((await signupPOST(req)).status).toBe(400);
    });

    it('returns 409 if email is already registered', async () => {
      mockFindFirst.mockResolvedValueOnce({ id: 'cust-1' });
      const req = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Sarah Jenkins',
          email: 'customer@client.com',
          password: 'password123',
        }),
      });
      expect((await signupPOST(req)).status).toBe(409);
    });

    it('creates a new user and returns 201 with auth cookie', async () => {
      mockFindFirst.mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce({
        id: 'cust-999999',
        name: 'Alex Morgan',
        email: 'alex@acme.io',
        role: 'customer',
        avatar: null,
        initials: 'AM',
        company: 'Morgan Corp',
      });

      const req = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Alex Morgan',
          email: 'ALEX@acme.io',
          password: 'password123',
          company: 'Morgan Corp',
        }),
      });

      const res = await signupPOST(req);
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.user.initials).toBe('AM');
      expect(res.cookies.get('auth_token')?.value).toBeTruthy();
    });
  });

  describe('GET /api/auth/me & POST /api/auth/logout', () => {
    it('returns authenticated: false when there is no session', async () => {
      mockGetSessionUser.mockResolvedValueOnce(null);
      const req = new NextRequest('http://localhost:3000/api/auth/me');
      const res = await meGET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.authenticated).toBe(false);
      expect(body.user).toBeNull();
    });

    it('returns user profile when session is valid', async () => {
      mockGetSessionUser.mockResolvedValueOnce({ userId: 'usr-1' });
      mockFindUnique.mockResolvedValueOnce({
        id: 'usr-1',
        name: 'Jason Duong',
        email: 'jason.duong@acme.io',
        role: 'admin',
        avatar: null,
        initials: 'JD',
        company: 'Acme Support',
      });

      const req = new NextRequest('http://localhost:3000/api/auth/me');
      const res = await meGET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.authenticated).toBe(true);
      expect(body.user.id).toBe('usr-1');
    });

    it('returns authenticated: false when user no longer exists in DB and 500 on DB error', async () => {
      mockGetSessionUser.mockResolvedValueOnce({ userId: 'usr-deleted' });
      mockFindUnique.mockResolvedValueOnce(null);

      const missingRes = await meGET(new NextRequest('http://localhost:3000/api/auth/me'));
      expect((await missingRes.json()).authenticated).toBe(false);

      mockGetSessionUser.mockRejectedValueOnce(new Error('DB timeout'));
      const errRes = await meGET(new NextRequest('http://localhost:3000/api/auth/me'));
      expect(errRes.status).toBe(500);
    });

    it('clears auth_token cookie on logout', async () => {
      const res = await logoutPOST();
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(res.cookies.get('auth_token')?.value).toBe('');
    });
  });
});
