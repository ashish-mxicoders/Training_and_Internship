import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const {
  mockTicketFindMany,
  mockTicketFindUnique,
  mockTicketCreate,
  mockTicketUpdate,
  mockTicketDelete,
  mockCommentCreate,
  mockCategoryFindMany,
  mockCategoryUpsert,
  mockUserFindMany,
  mockGetSessionUser,
} = vi.hoisted(() => ({
  mockTicketFindMany: vi.fn(),
  mockTicketFindUnique: vi.fn(),
  mockTicketCreate: vi.fn(),
  mockTicketUpdate: vi.fn(),
  mockTicketDelete: vi.fn(),
  mockCommentCreate: vi.fn(),
  mockCategoryFindMany: vi.fn(),
  mockCategoryUpsert: vi.fn(),
  mockUserFindMany: vi.fn(),
  mockGetSessionUser: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    ticket: {
      findMany: mockTicketFindMany,
      findUnique: mockTicketFindUnique,
      create: mockTicketCreate,
      update: mockTicketUpdate,
      delete: mockTicketDelete,
    },
    comment: {
      create: mockCommentCreate,
    },
    category: {
      findMany: mockCategoryFindMany,
      upsert: mockCategoryUpsert,
    },
    user: {
      findMany: mockUserFindMany,
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  getSessionUser: mockGetSessionUser,
}));

import { GET as ticketsGET, POST as ticketsPOST } from '@/app/api/tickets/route';
import {
  GET as ticketByIdGET,
  PATCH as ticketByIdPATCH,
  DELETE as ticketByIdDELETE,
} from '@/app/api/tickets/[id]/route';
import { POST as commentPOST } from '@/app/api/tickets/[id]/comments/route';
import { GET as categoriesGET, POST as categoriesPOST } from '@/app/api/categories/route';
import { GET as usersGET } from '@/app/api/users/route';

const sampleDbTicket = {
  id: '10',
  subject: 'API latency spike',
  description: 'p99 latency above 2s',
  status: 'open',
  priority: 'high',
  categoryId: 'technical',
  channel: 'email',
  health: 'warning',
  dueDate: '2026-11-15',
  isEscalated: false,
  isPastDue: false,
  tags: ['API'],
  createdAt: new Date('2026-11-01T00:00:00Z'),
  updatedAt: new Date('2026-11-02T00:00:00Z'),
  assignee: {
    id: 'usr-1',
    name: 'Jason Duong',
    email: 'jason.duong@acme.io',
    initials: 'JD',
    avatar: null,
    role: 'admin',
  },
  customer: {
    name: 'Sarah Jenkins',
    company: 'Pine & Peak Inc.',
    email: 'customer@client.com',
    avatar: null,
  },
  customerName: 'Sarah Jenkins',
  customerCompany: 'Pine & Peak Inc.',
  customerEmail: 'customer@client.com',
  comments: [],
};

describe('Tickets, Comments, Categories & Users API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET / POST /api/tickets', () => {
    it('scopes ticket query for customer role', async () => {
      mockGetSessionUser.mockResolvedValueOnce({
        userId: 'cust-1',
        email: 'customer@client.com',
        role: 'customer',
      });
      mockTicketFindMany.mockResolvedValueOnce([sampleDbTicket]);

      const req = new NextRequest('http://localhost:3000/api/tickets');
      const res = await ticketsGET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.tickets).toHaveLength(1);
      expect(mockTicketFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { customerId: 'cust-1' },
              { customerEmail: { equals: 'customer@client.com', mode: 'insensitive' } },
            ],
          },
        })
      );
    });

    it('returns 400 when subject or description is missing on POST', async () => {
      mockGetSessionUser.mockResolvedValueOnce({ userId: 'usr-1', role: 'admin' });

      const req = new NextRequest('http://localhost:3000/api/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject: '', description: 'Details' }),
      });
      expect((await ticketsPOST(req)).status).toBe(400);

      mockGetSessionUser.mockResolvedValueOnce({ userId: 'usr-1', role: 'admin' });
      const reqNoDesc = new NextRequest('http://localhost:3000/api/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject: 'Bug', description: '   ' }),
      });
      expect((await ticketsPOST(reqNoDesc)).status).toBe(400);
    });

    it('creates a ticket with sequential ID on valid POST', async () => {
      mockGetSessionUser.mockResolvedValueOnce({
        userId: 'cust-1',
        name: 'Sarah Jenkins',
        email: 'customer@client.com',
        role: 'customer',
        company: 'Pine & Peak Inc.',
      });
      mockTicketFindMany.mockResolvedValueOnce([{ id: '1' }, { id: '20' }]);
      mockTicketCreate.mockResolvedValueOnce({ ...sampleDbTicket, id: '21' });

      const req = new NextRequest('http://localhost:3000/api/tickets', {
        method: 'POST',
        body: JSON.stringify({
          subject: 'Webhook retry failing',
          description: 'Seeing 502 responses on webhook delivery',
          priority: 'urgent',
        }),
      });

      const res = await ticketsPOST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.ticket.id).toBe('21');
      expect(mockTicketCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: '21',
            customerId: 'cust-1',
          }),
        })
      );
    });
    it('allows admin to create ticket with custom customer fields and escalated status', async () => {
      mockGetSessionUser.mockResolvedValueOnce({
        userId: 'usr-1',
        role: 'admin',
      });
      mockTicketFindMany.mockResolvedValueOnce([]);
      mockTicketCreate.mockResolvedValueOnce({
        ...sampleDbTicket,
        id: '1',
        assignee: null,
        customer: null,
      });

      const req = new NextRequest('http://localhost:3000/api/tickets', {
        method: 'POST',
        body: JSON.stringify({
          subject: 'Escalated outage',
          description: 'Production outage',
          status: 'escalated',
          customerName: 'Acme Corp',
          companyName: 'Acme Inc',
          customerEmail: 'ops@acme.com',
        }),
      });
      const res = await ticketsPOST(req);
      expect(res.status).toBe(200);
      expect(mockTicketCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: '1',
            status: 'open',
            isEscalated: true,
          }),
        })
      );
    });

    it('returns 500 when database throws on GET/POST tickets', async () => {
      mockGetSessionUser.mockResolvedValueOnce({ userId: 'usr-1', role: 'admin' });
      mockTicketFindMany.mockRejectedValueOnce(new Error('DB connection lost'));
      expect((await ticketsGET(new NextRequest('http://localhost:3000/api/tickets'))).status).toBe(500);

      mockGetSessionUser.mockResolvedValueOnce({ userId: 'usr-1', role: 'admin' });
      mockTicketFindMany.mockRejectedValueOnce(new Error('Insert error'));
      const postReq = new NextRequest('http://localhost:3000/api/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject: 'Test', description: 'Test desc' }),
      });
      expect((await ticketsPOST(postReq)).status).toBe(500);
    });
  });

  describe('GET / PATCH / DELETE /api/tickets/[id]', () => {
    it('returns 404 when ticket is not found', async () => {
      mockTicketFindUnique.mockResolvedValueOnce(null);

      const req = new NextRequest('http://localhost:3000/api/tickets/999');
      const res = await ticketByIdGET(req, { params: Promise.resolve({ id: '999' }) });
      expect(res.status).toBe(404);
    });

    it('returns ticket details when found', async () => {
      mockTicketFindUnique.mockResolvedValueOnce(sampleDbTicket);

      const req = new NextRequest('http://localhost:3000/api/tickets/10');
      const res = await ticketByIdGET(req, { params: Promise.resolve({ id: '10' }) });
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.ticket.id).toBe('10');
    });

    it('blocks customer from changing status via PATCH (403) and allows admin (200)', async () => {
      mockGetSessionUser.mockResolvedValueOnce({ userId: 'cust-1', role: 'customer' });
      const customerReq = new NextRequest('http://localhost:3000/api/tickets/10', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'resolved' }),
      });
      const customerRes = await ticketByIdPATCH(customerReq, {
        params: Promise.resolve({ id: '10' }),
      });
      expect(customerRes.status).toBe(403);

      mockGetSessionUser.mockResolvedValueOnce({ userId: 'usr-1', role: 'admin' });
      mockTicketUpdate.mockResolvedValueOnce({ id: '10' });
      const adminReq = new NextRequest('http://localhost:3000/api/tickets/10', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'resolved', priority: 'low' }),
      });
      const adminRes = await ticketByIdPATCH(adminReq, {
        params: Promise.resolve({ id: '10' }),
      });
      expect(adminRes.status).toBe(200);

      mockGetSessionUser.mockResolvedValueOnce({ userId: 'usr-1', role: 'admin' });
      const noopReq = new NextRequest('http://localhost:3000/api/tickets/10', {
        method: 'PATCH',
        body: JSON.stringify({}),
      });
      const noopRes = await ticketByIdPATCH(noopReq, {
        params: Promise.resolve({ id: '10' }),
      });
      expect(noopRes.status).toBe(200);
      expect((await noopRes.json()).message).toBe('No fields to update');
    });

    it('blocks customer from deleting ticket (403) and allows admin (200)', async () => {
      mockGetSessionUser.mockResolvedValueOnce({ userId: 'cust-1', role: 'customer' });
      const customerReq = new NextRequest('http://localhost:3000/api/tickets/10', {
        method: 'DELETE',
      });
      expect(
        (await ticketByIdDELETE(customerReq, { params: Promise.resolve({ id: '10' }) }))
          .status
      ).toBe(403);

      mockGetSessionUser.mockResolvedValueOnce({ userId: 'usr-1', role: 'admin' });
      mockTicketDelete.mockResolvedValueOnce({ id: '10' });
      const adminReq = new NextRequest('http://localhost:3000/api/tickets/10', {
        method: 'DELETE',
      });
      expect(
        (await ticketByIdDELETE(adminReq, { params: Promise.resolve({ id: '10' }) }))
          .status
      ).toBe(200);
    });
  });

  describe('POST /api/tickets/[id]/comments', () => {
    it('rejects empty comments (400) and saves valid comments (200)', async () => {
      mockGetSessionUser.mockResolvedValueOnce({
        userId: 'usr-1',
        name: 'Jason Duong',
        initials: 'JD',
      });

      const emptyReq = new NextRequest('http://localhost:3000/api/tickets/10/comments', {
        method: 'POST',
        body: JSON.stringify({ content: '   ' }),
      });
      expect(
        (await commentPOST(emptyReq, { params: Promise.resolve({ id: '10' }) })).status
      ).toBe(400);

      mockGetSessionUser.mockResolvedValueOnce({
        userId: 'usr-1',
        name: 'Jason Duong',
        initials: 'JD',
      });
      mockCommentCreate.mockResolvedValueOnce({});

      const validReq = new NextRequest('http://localhost:3000/api/tickets/10/comments', {
        method: 'POST',
        body: JSON.stringify({ content: 'Investigating the issue now.' }),
      });
      const res = await commentPOST(validReq, { params: Promise.resolve({ id: '10' }) });
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.comment.content).toBe('Investigating the issue now.');
    });
  });

  describe('GET/POST /api/categories & GET /api/users', () => {
    it('lists and creates categories', async () => {
      mockCategoryFindMany.mockResolvedValueOnce([
        { id: 'technical', name: 'Technical Issue' },
      ]);
      const getRes = await categoriesGET();
      expect(getRes.status).toBe(200);

      const badReq = new NextRequest('http://localhost:3000/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name: '' }),
      });
      expect((await categoriesPOST(badReq)).status).toBe(400);

      mockCategoryUpsert.mockResolvedValueOnce({
        id: 'security-audit',
        name: 'Security Audit',
      });
      const okReq = new NextRequest('http://localhost:3000/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name: 'Security Audit' }),
      });
      const postRes = await categoriesPOST(okReq);
      expect(postRes.status).toBe(200);
    });

    it('returns support admin users and handles DB error', async () => {
      mockUserFindMany.mockResolvedValueOnce([
        { id: 'usr-1', name: 'Jason Duong', role: 'admin' },
      ]);
      const res = await usersGET();
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.users).toHaveLength(1);

      mockUserFindMany.mockRejectedValueOnce(new Error('Query failed'));
      expect((await usersGET()).status).toBe(500);
    });
  });
});
