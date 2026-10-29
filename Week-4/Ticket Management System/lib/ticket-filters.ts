// =====================================================================
// Ticket Filtering, Sorting & Statistics Helpers
// Extracted pure functions to keep ticket-context clean and maintainable.
// =====================================================================

import {
  AppUser,
  ColumnSortType,
  Ticket,
  TicketChannel,
  TicketHealth,
  TicketPriority,
  TicketStats,
  TicketStatus,
  ViewFilter,
} from '@/types';

export interface FilterCriteria {
  viewFilter: ViewFilter;
  categoryFilter: string | 'all';
  priorityFilter: TicketPriority | 'all';
  statusFilter: TicketStatus | 'all';
  healthFilter: TicketHealth | 'all';
  channelFilter: TicketChannel | 'all';
  assigneeFilter: string | 'all';
  searchQuery: string;
}

/**
 * Filter tickets based on active filter criteria and user RBAC permissions
 */
export function computeFilteredTickets(
  tickets: Ticket[],
  currentUser: AppUser | null,
  filters: FilterCriteria
): Ticket[] {
  const {
    viewFilter,
    categoryFilter,
    priorityFilter,
    statusFilter,
    healthFilter,
    channelFilter,
    assigneeFilter,
    searchQuery,
  } = filters;

  return tickets.filter((ticket) => {
    // RBAC: Customer only sees tickets matching their email or name
    if (currentUser && currentUser.role === 'customer') {
      const matchCustomer =
        ticket.customer?.email?.toLowerCase() === currentUser.email.toLowerCase() ||
        ticket.customer?.name?.toLowerCase() === currentUser.name.toLowerCase();
      if (!matchCustomer) return false;
    }

    // Views filter
    if (viewFilter === 'my') {
      if (!ticket.assignee || ticket.assignee.id !== currentUser?.id) {
        return false;
      }
    }
    if (viewFilter === 'unassigned' && ticket.assignee !== undefined) {
      return false;
    }
    if (viewFilter === 'past_due' && !ticket.isPastDue) {
      return false;
    }
    if (viewFilter === 'escalated' && !ticket.isEscalated) {
      return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && ticket.category !== categoryFilter) {
      return false;
    }

    // Priority filter
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && ticket.status !== statusFilter) {
      return false;
    }

    // Health filter
    if (healthFilter !== 'all' && ticket.health !== healthFilter) {
      return false;
    }

    // Channel filter
    if (channelFilter !== 'all' && ticket.channel !== channelFilter) {
      return false;
    }

    // Assignee filter
    if (assigneeFilter !== 'all') {
      if (assigneeFilter === 'unassigned') {
        if (ticket.assignee !== undefined) return false;
      } else {
        if (ticket.assignee?.id !== assigneeFilter) return false;
      }
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = ticket.id.toLowerCase().includes(q);
      const matchSubject = ticket.subject.toLowerCase().includes(q);
      const matchCustomer =
        ticket.customer.name.toLowerCase().includes(q) ||
        ticket.customer.company.toLowerCase().includes(q);
      const matchAssignee = ticket.assignee?.name.toLowerCase().includes(q);
      if (!matchId && !matchSubject && !matchCustomer && !matchAssignee) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calculates aggregate dashboard stats
 */
export function computeTicketStats(
  tickets: Ticket[],
  currentUser: AppUser | null
): TicketStats {
  const list =
    currentUser && currentUser.role === 'customer'
      ? tickets.filter(
          (t) =>
            t.customer?.email?.toLowerCase() === currentUser.email.toLowerCase() ||
            t.customer?.name?.toLowerCase() === currentUser.name.toLowerCase()
        )
      : tickets;

  const total = list.length;
  const open = list.filter((t) => t.status === 'open').length;
  const pending = list.filter((t) => t.status === 'pending').length;
  const resolved = list.filter((t) => t.status === 'resolved').length;
  const closed = list.filter((t) => t.status === 'closed').length;

  return {
    total,
    open,
    pending,
    resolved,
    closed,
    totalChangePct: 17.6,
    openChangePct: -20,
    pendingChangePct: -16.7,
    resolvedChangePct: 100,
  };
}

/**
 * Counts total active filter parameters
 */
export function countActiveFilters(filters: FilterCriteria): number {
  let count = 0;
  if (filters.categoryFilter !== 'all') count++;
  if (filters.priorityFilter !== 'all') count++;
  if (filters.statusFilter !== 'all') count++;
  if (filters.healthFilter !== 'all') count++;
  if (filters.channelFilter !== 'all') count++;
  if (filters.assigneeFilter !== 'all') count++;
  if (filters.viewFilter !== 'all') count++;
  if (filters.searchQuery.trim() !== '') count++;
  return count;
}

/**
 * Sorts tickets within a specific Kanban column
 */
export function sortColumnTickets(
  tickets: Ticket[],
  sort: ColumnSortType
): Ticket[] {
  if (sort === 'none') return tickets;
  const copy = [...tickets];
  const priorityWeights: Record<TicketPriority, number> = {
    urgent: 5,
    high: 4,
    medium: 3,
    low: 2,
    todo: 1,
  };
  const healthWeights: Record<TicketHealth, number> = {
    breached: 3,
    warning: 2,
    on_track: 1,
  };

  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'oldest':
      return copy.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case 'priority_high':
      return copy.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);
    case 'priority_low':
      return copy.sort((a, b) => priorityWeights[a.priority] - priorityWeights[b.priority]);
    case 'health':
      return copy.sort((a, b) => healthWeights[b.health] - healthWeights[a.health]);
    default:
      return copy;
  }
}

