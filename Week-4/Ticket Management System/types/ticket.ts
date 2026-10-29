export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';

export type TicketPriority = 'urgent' | 'high' | 'medium' | 'low' | 'todo';

export type TicketCategory =
  | 'billing'
  | 'technical'
  | 'account'
  | 'subscription'
  | 'other'
  | 'access';

export type TicketChannel = 'email' | 'chat' | 'slack' | 'web';

export type TicketHealth = 'on_track' | 'warning' | 'breached';

export type ViewFilter = 'all' | 'my' | 'unassigned' | 'past_due' | 'escalated';

export interface TicketAssignee {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar?: string;
  role: string;
}

export interface TicketCustomer {
  name: string;
  company: string;
  email: string;
  avatar?: string;
}

export interface TicketComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorInitials: string;
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  channel: TicketChannel;
  health: TicketHealth;
  assignee?: TicketAssignee;
  customer: TicketCustomer;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  comments: TicketComment[];
  isEscalated?: boolean;
  isPastDue?: boolean;
}

export interface TicketStats {
  total: number;
  open: number;
  pending: number;
  resolved: number;
  closed: number;
  totalChangePct: number;
  openChangePct: number;
  pendingChangePct: number;
  resolvedChangePct: number;
}
