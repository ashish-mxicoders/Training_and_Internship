import { describe, expect, it } from 'vitest';
import {
  computeFilteredTickets,
  computeTicketStats,
  countActiveFilters,
  sortColumnTickets,
  type FilterCriteria,
} from '@/lib/ticket-filters';
import type { AppUser, Ticket } from '@/types';

const adminUser: AppUser = {
  id: 'usr-1',
  name: 'Jason Duong',
  email: 'jason.duong@acme.io',
  role: 'admin',
  initials: 'JD',
};

const customerUser: AppUser = {
  id: 'cust-1',
  name: 'Sarah Jenkins',
  email: 'customer@client.com',
  role: 'customer',
  initials: 'SJ',
  company: 'Pine & Peak Inc.',
};

const baseFilters: FilterCriteria = {
  viewFilter: 'all',
  categoryFilter: 'all',
  priorityFilter: 'all',
  statusFilter: 'all',
  healthFilter: 'all',
  channelFilter: 'all',
  assigneeFilter: 'all',
  searchQuery: '',
};

const sampleTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Okta SSO callback fails',
    description: '401 error on callback',
    status: 'open',
    priority: 'urgent',
    category: 'technical',
    channel: 'email',
    health: 'breached',
    assignee: {
      id: 'usr-1',
      name: 'Jason Duong',
      email: 'jason.duong@acme.io',
      initials: 'JD',
      role: 'admin',
    },
    customer: {
      name: 'Sarah Jenkins',
      company: 'Pine & Peak Inc.',
      email: 'customer@client.com',
    },
    dueDate: '2026-10-30',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-02',
    tags: ['SSO'],
    comments: [],
    isEscalated: true,
    isPastDue: true,
  },
  {
    id: '2',
    subject: 'Invoice split request',
    description: 'Split billing across teams',
    status: 'pending',
    priority: 'medium',
    category: 'billing',
    channel: 'web',
    health: 'warning',
    assignee: undefined,
    customer: {
      name: 'Marcus Vance',
      company: 'Vance Logic',
      email: 'm.vance@vancetech.io',
    },
    dueDate: '2026-11-05',
    createdAt: '2026-10-03',
    updatedAt: '2026-10-04',
    tags: ['BILLING'],
    comments: [],
    isEscalated: false,
    isPastDue: false,
  },
  {
    id: '3',
    subject: 'Password reset link expired',
    description: 'Customer needs fresh invite',
    status: 'resolved',
    priority: 'low',
    category: 'account',
    channel: 'chat',
    health: 'on_track',
    assignee: {
      id: 'usr-2',
      name: 'Annie Nguyen',
      email: 'annie.nguyen@acme.io',
      initials: 'AN',
      role: 'admin',
    },
    customer: {
      name: 'Sarah Jenkins',
      company: 'Pine & Peak Inc.',
      email: 'customer@client.com',
    },
    dueDate: '2026-11-10',
    createdAt: '2026-10-02',
    updatedAt: '2026-10-05',
    tags: [],
    comments: [],
    isEscalated: false,
    isPastDue: false,
  },
];

describe('ticket-filters unit tests', () => {
  it('enforces RBAC so customers only see their own tickets', () => {
    const result = computeFilteredTickets(sampleTickets, customerUser, baseFilters);
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id)).toEqual(['1', '3']);
  });

  it('allows admins to see all tickets and apply view filters', () => {
    expect(computeFilteredTickets(sampleTickets, adminUser, baseFilters)).toHaveLength(3);

    expect(
      computeFilteredTickets(sampleTickets, adminUser, {
        ...baseFilters,
        viewFilter: 'my',
      }).map((t) => t.id)
    ).toEqual(['1']);

    expect(
      computeFilteredTickets(sampleTickets, adminUser, {
        ...baseFilters,
        viewFilter: 'unassigned',
      }).map((t) => t.id)
    ).toEqual(['2']);

    expect(
      computeFilteredTickets(sampleTickets, adminUser, {
        ...baseFilters,
        viewFilter: 'past_due',
      }).map((t) => t.id)
    ).toEqual(['1']);

    expect(
      computeFilteredTickets(sampleTickets, adminUser, {
        ...baseFilters,
        viewFilter: 'escalated',
      }).map((t) => t.id)
    ).toEqual(['1']);
  });

  it('filters by category, priority, status, health, channel, assignee, and search', () => {
    expect(
      computeFilteredTickets(sampleTickets, adminUser, {
        ...baseFilters,
        categoryFilter: 'billing',
        priorityFilter: 'medium',
        statusFilter: 'pending',
        healthFilter: 'warning',
        channelFilter: 'web',
        assigneeFilter: 'unassigned',
      }).map((t) => t.id)
    ).toEqual(['2']);

    expect(
      computeFilteredTickets(sampleTickets, adminUser, {
        ...baseFilters,
        assigneeFilter: 'usr-2',
      }).map((t) => t.id)
    ).toEqual(['3']);

    expect(
      computeFilteredTickets(sampleTickets, adminUser, {
        ...baseFilters,
        searchQuery: 'Vance',
      }).map((t) => t.id)
    ).toEqual(['2']);
  });

  it('computes ticket stats scoped by user role', () => {
    const adminStats = computeTicketStats(sampleTickets, adminUser);
    expect(adminStats.total).toBe(3);
    expect(adminStats.open).toBe(1);
    expect(adminStats.pending).toBe(1);
    expect(adminStats.resolved).toBe(1);

    const customerStats = computeTicketStats(sampleTickets, customerUser);
    expect(customerStats.total).toBe(2);
    expect(customerStats.pending).toBe(0);
  });

  it('counts active filters accurately', () => {
    expect(countActiveFilters(baseFilters)).toBe(0);
    expect(
      countActiveFilters({
        ...baseFilters,
        categoryFilter: 'technical',
        priorityFilter: 'high',
        statusFilter: 'open',
        healthFilter: 'breached',
        channelFilter: 'email',
        assigneeFilter: 'usr-1',
        viewFilter: 'my',
        searchQuery: 'okta',
      })
    ).toBe(8);
  });

  it('sorts column tickets by newest, oldest, priority, and health', () => {
    expect(sortColumnTickets(sampleTickets, 'none').map((t) => t.id)).toEqual([
      '1',
      '2',
      '3',
    ]);
    expect(sortColumnTickets(sampleTickets, 'newest').map((t) => t.id)).toEqual([
      '2',
      '3',
      '1',
    ]);
    expect(sortColumnTickets(sampleTickets, 'oldest').map((t) => t.id)).toEqual([
      '1',
      '3',
      '2',
    ]);
    expect(sortColumnTickets(sampleTickets, 'priority_high').map((t) => t.id)).toEqual([
      '1',
      '2',
      '3',
    ]);
    expect(sortColumnTickets(sampleTickets, 'priority_low').map((t) => t.id)).toEqual([
      '3',
      '2',
      '1',
    ]);
    expect(sortColumnTickets(sampleTickets, 'health').map((t) => t.id)).toEqual([
      '1',
      '2',
      '3',
    ]);
  });
});
