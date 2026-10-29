'use client';

// =====================================================================
// Ticket Context & Global State Management
// Beginner-friendly React Context without external state libraries.
//
// Key Features:
// 1. Neon PostgreSQL Backend Synchronization (via Next.js /api routes)
// 2. Role-Based Access Control (Admin vs Customer)
// 3. Status pre-selection when clicking '+' on Kanban columns
// 4. Custom Theme-matched "Coming Soon" Alert Modal
// 5. Dynamic Category Management (Add new categories to DB)
// =====================================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  TicketChannel,
  TicketHealth,
  ViewFilter,
  TicketStats,
  TicketComment,
} from '@/types/ticket';
import { INITIAL_TICKETS, CURRENT_USER, TEAM_MEMBERS } from '@/lib/mock-data';
import { ComingSoonModal } from '@/components/ui/CustomModal';

export type ColumnSortType =
  | 'none'
  | 'newest'
  | 'oldest'
  | 'priority_high'
  | 'priority_low'
  | 'health'
  | 'priority-desc'
  | 'priority-asc'
  | 'due-asc'
  | 'due-desc'
  | 'title-asc'
  | 'title-desc';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  avatar?: string;
  initials: string;
  company?: string;
  tier?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
}

interface TicketContextType {
  tickets: Ticket[];
  filteredTickets: Ticket[];
  selectedTicket: Ticket | null;
  setSelectedTicket: (ticket: Ticket | null) => void;
  stats: TicketStats;
  isLoaded: boolean;

  // Authentication & RBAC
  currentUser: AppUser | null;
  loginUser: (user: AppUser) => void;
  logoutUser: () => Promise<void>;
  switchUserRole: (role: 'admin' | 'customer') => void;

  // Filter State
  viewFilter: ViewFilter;
  setViewFilter: (view: ViewFilter) => void;
  categoryFilter: string | 'all';
  setCategoryFilter: (category: string | 'all') => void;
  priorityFilter: TicketPriority | 'all';
  setPriorityFilter: (priority: TicketPriority | 'all') => void;
  statusFilter: TicketStatus | 'all';
  setStatusFilter: (status: TicketStatus | 'all') => void;
  healthFilter: TicketHealth | 'all';
  setHealthFilter: (health: TicketHealth | 'all') => void;
  channelFilter: TicketChannel | 'all';
  setChannelFilter: (channel: TicketChannel | 'all') => void;
  assigneeFilter: string | 'all';
  setAssigneeFilter: (assignee: string | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearAllFilters: () => void;
  activeFilterCount: number;
  activeViewMode: 'kanban' | 'table';
  setActiveViewMode: (mode: 'kanban' | 'table') => void;

  // Column Sorting
  columnSorts: Record<TicketStatus, ColumnSortType>;
  setColumnSort: (status: TicketStatus, sort: ColumnSortType) => void;

  // Actions
  addTicket: (newTicket: any) => Promise<Ticket>;
  updateTicketStatus: (id: string, status: TicketStatus) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  addComment: (ticketId: string, content: string) => Promise<void>;
  deleteTicket: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshTickets: () => Promise<void>;

  // Categories
  categories: CategoryItem[];
  addCategory: (name: string) => Promise<boolean>;

  // Layout & UI
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;

  // Modal Control (with column status pre-selection)
  isNewTicketModalOpen: boolean;
  setIsNewTicketModalOpen: (open: boolean) => void;
  initialModalStatus: TicketStatus;
  openNewTicketWithStatus: (status: TicketStatus) => void;

  // Custom "Coming Soon" Alert
  showComingSoon: (featureName?: string) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

const THEME_KEY = 'tms_theme_preference';

export function TicketProvider({ children }: { children: React.ReactNode }) {
  // 1. Current Logged-in User (Defaults to null until authenticated via /api/auth/me)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  // 2. Tickets & Selected Ticket State
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 3. Categories State (Loaded from DB)
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: 'technical', name: 'Technical Issue' },
    { id: 'billing', name: 'Billing' },
    { id: 'account', name: 'Account & Login' },
    { id: 'subscription', name: 'Subscription' },
    { id: 'access', name: 'Access' },
    { id: 'other', name: 'Other' },
  ]);

  // 4. Filter State
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [healthFilter, setHealthFilter] = useState<TicketHealth | 'all'>('all');
  const [channelFilter, setChannelFilter] = useState<TicketChannel | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeViewMode, setActiveViewMode] = useState<'kanban' | 'table'>('kanban');

  // 5. Column Sort State
  const [columnSorts, setColumnSorts] = useState<Record<TicketStatus, ColumnSortType>>({
    open: 'none',
    pending: 'none',
    resolved: 'none',
    closed: 'none',
  });

  const setColumnSort = (status: TicketStatus, sort: ColumnSortType) => {
    setColumnSorts((prev) => ({
      ...prev,
      [status]: sort,
    }));
  };

  // 6. UI & Modals State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [initialModalStatus, setInitialModalStatus] = useState<TicketStatus>('open');

  // Custom Coming Soon Modal state
  const [comingSoonState, setComingSoonState] = useState<{
    isOpen: boolean;
    featureName: string;
  }>({
    isOpen: false,
    featureName: 'This feature',
  });

  const showComingSoon = useCallback((featureName?: string) => {
    setComingSoonState({
      isOpen: true,
      featureName: featureName || 'This feature',
    });
  }, []);

  /**
   * Helper to open the New Ticket Modal with the status of the clicked column.
   * User requirement: "+ icon click kiya to status me vo selected aana chahiye"
   */
  const openNewTicketWithStatus = useCallback((status: TicketStatus) => {
    setInitialModalStatus(status);
    setIsNewTicketModalOpen(true);
  }, []);

  // 7. Load Categories from DB
  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      }
    } catch (_error) {
      // Graceful fallback to default categories
    }
  }, []);

  // 8. Fetch Tickets from Database (automatically filtered by user role in /api/tickets)
  const refreshTickets = useCallback(async () => {
    try {
      const res = await fetch('/api/tickets');
      if (res.ok) {
        const data = await res.json();
        if (data.tickets && Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        }
      }
    } catch (_error) {
      // Graceful fallback to local state
    }
  }, []);

  // 9. Initial Load on Client Mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = window.localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
        if (savedTheme) {
          setTheme(savedTheme);
        }
        if (window.innerWidth < 768) {
          setIsSidebarCollapsed(true);
        }
      }
    } catch (e) {
      // ignore
    }

    // Check if session exists in /api/auth/me
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          refreshTickets();
        } else {
          setCurrentUser(null);
          setTickets([]);
        }
      })
      .catch(() => {
        setCurrentUser(null);
        setTickets([]);
      })
      .finally(() => {
        loadCategories();
        setIsLoaded(true);
      });
  }, [refreshTickets, loadCategories]);

  // Sync theme changes to <html> class
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        window.localStorage.setItem(THEME_KEY, theme);
      } catch (e) {}
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // User Auth Actions
  const loginUser = useCallback((user: AppUser) => {
    setCurrentUser(user);
    // Refresh tickets for the newly logged-in user
    setTimeout(() => {
      refreshTickets();
    }, 100);
  }, [refreshTickets]);

  const logoutUser = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setCurrentUser(null);
    setTickets([]);
  }, []);

  /**
   * Quick role switcher for demo/testing convenience
   */
  const switchUserRole = useCallback((role: 'admin' | 'customer') => {
    if (role === 'admin') {
      const adminUser: AppUser = {
        id: 'usr-1',
        name: 'Jason Duong',
        email: 'jason.duong@acme.io',
        role: 'admin',
        avatar: '/images/avatar-jason.jpg',
        initials: 'JD',
        company: 'Acme Support Desk',
      };
      setCurrentUser(adminUser);
    } else {
      const customerUser: AppUser = {
        id: 'cust-1',
        name: 'Sarah Jenkins',
        email: 'customer@client.com',
        role: 'customer',
        initials: 'SJ',
        company: 'Pine & Peak Inc.',
        tier: 'Enterprise',
      };
      setCurrentUser(customerUser);
    }
    setTimeout(() => {
      refreshTickets();
    }, 100);
  }, [refreshTickets]);

  // Clear filters
  const clearAllFilters = useCallback(() => {
    setViewFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setStatusFilter('all');
    setHealthFilter('all');
    setChannelFilter('all');
    setAssigneeFilter('all');
    setSearchQuery('');
  }, []);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== 'all') count++;
    if (priorityFilter !== 'all') count++;
    if (statusFilter !== 'all') count++;
    if (healthFilter !== 'all') count++;
    if (channelFilter !== 'all') count++;
    if (assigneeFilter !== 'all') count++;
    if (viewFilter !== 'all') count++;
    if (searchQuery.trim() !== '') count++;
    return count;
  }, [
    categoryFilter,
    priorityFilter,
    statusFilter,
    healthFilter,
    channelFilter,
    assigneeFilter,
    viewFilter,
    searchQuery,
  ]);

  // Action: Add Ticket (Sends to PostgreSQL backend)
  const addTicket = async (newTicketData: any): Promise<Ticket> => {
    const tempId = `#-0${tickets.length + 1 < 10 ? '0' + (tickets.length + 1) : tickets.length + 1}`;
    const today = new Date().toISOString().split('T')[0];

    const localTicket: Ticket = {
      ...newTicketData,
      id: tempId,
      createdAt: today,
      updatedAt: today,
      comments: [],
    };

    // Optimistic UI update
    setTickets((prev) => [localTicket, ...prev]);

    // Send to backend database
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newTicketData.subject,
          description: newTicketData.description,
          status: newTicketData.status,
          priority: newTicketData.priority,
          category: newTicketData.category,
          channel: newTicketData.channel,
          health: newTicketData.health,
          assigneeId: newTicketData.assignee?.id || null,
          customerName: newTicketData.customer?.name,
          companyName: newTicketData.customer?.company,
          customerEmail: newTicketData.customer?.email,
          dueDate: newTicketData.dueDate,
          isEscalated: newTicketData.isEscalated,
          tags: newTicketData.tags,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ticket) {
          // Replace temporary ticket with real DB ticket
          setTickets((prev) =>
            prev.map((t) => (t.id === tempId ? data.ticket : t))
          );
          return data.ticket;
        }
      }
    } catch (_err) {
      // Kept in local state if API is unreachable
    }

    return localTicket;
  };

  // Action: Update Status (Sends to PostgreSQL backend)
  const updateTicketStatus = async (id: string, status: TicketStatus) => {
    // Optimistic update
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status, updatedAt: new Date().toISOString().split('T')[0] }
          : t
      )
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) => (prev ? { ...prev, status } : null));
    }

    try {
      await fetch(`/api/tickets/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (_e) {
      // Handled optimistically
    }
  };

  // Action: Update Generic Properties (Sends to PostgreSQL backend)
  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updates,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : t
      )
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) => (prev ? { ...prev, ...updates } : null));
    }

    try {
      await fetch(`/api/tickets/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updates.status,
          priority: updates.priority,
          health: updates.health,
          assigneeId: updates.assignee?.id,
          isEscalated: updates.isEscalated,
          subject: updates.subject,
          description: updates.description,
          dueDate: updates.dueDate,
        }),
      });
    } catch (_e) {
      // Handled optimistically
    }
  };

  // Action: Add Comment (Sends to PostgreSQL backend)
  const addComment = async (ticketId: string, content: string) => {
    const authorName = currentUser?.name || 'Support Team';
    const authorInitials = currentUser?.initials || 'ST';
    const authorAvatar = currentUser?.avatar;

    const newComment: TicketComment = {
      id: `cm-${Date.now()}`,
      authorName,
      authorAvatar,
      authorInitials,
      isInternal: false,
      content,
      timestamp: 'Just now',
    };

    // Optimistic update
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              comments: [...t.comments, newComment],
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : t
      )
    );

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments, newComment],
            }
          : null
      );
    }

    try {
      await fetch(`/api/tickets/${encodeURIComponent(ticketId)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          authorName,
          authorInitials,
        }),
      });
    } catch (_e) {
      // Handled optimistically
    }
  };

  // Action: Delete Ticket
  const deleteTicket = async (id: string): Promise<{ success: boolean; error?: string }> => {
    // If customer, block deletion
    if (currentUser && currentUser.role === 'customer') {
      return { success: false, error: 'Customers are not permitted to delete tickets.' };
    }

    // Optimistic removal
    setTickets((prev) => prev.filter((t) => t.id !== id));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket(null);
    }

    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error };
      }
    } catch (_e) {
      // Handled optimistically
    }

    return { success: true };
  };

  // Action: Add Category
  const addCategory = async (name: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await loadCategories();
        return true;
      }
    } catch (_e) {
      // Fallback
    }
    return false;
  };

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // If Customer, only see tickets matching their email or customer name
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
  }, [
    tickets,
    currentUser,
    viewFilter,
    categoryFilter,
    priorityFilter,
    statusFilter,
    healthFilter,
    channelFilter,
    assigneeFilter,
    searchQuery,
  ]);

  // Statistics calculation
  const stats: TicketStats = useMemo(() => {
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
  }, [tickets, currentUser]);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        filteredTickets,
        selectedTicket,
        setSelectedTicket,
        stats,
        isLoaded,

        // Auth & RBAC
        currentUser,
        loginUser,
        logoutUser,
        switchUserRole,

        // Filter state
        viewFilter,
        setViewFilter,
        categoryFilter,
        setCategoryFilter,
        priorityFilter,
        setPriorityFilter,
        statusFilter,
        setStatusFilter,
        healthFilter,
        setHealthFilter,
        channelFilter,
        setChannelFilter,
        assigneeFilter,
        setAssigneeFilter,
        searchQuery,
        setSearchQuery,
        clearAllFilters,
        activeFilterCount,
        activeViewMode,
        setActiveViewMode,

        // Column sort
        columnSorts,
        setColumnSort,

        // Actions
        addTicket,
        updateTicketStatus,
        updateTicket,
        addComment,
        deleteTicket,
        refreshTickets,

        // Categories
        categories,
        addCategory,

        // Layout & UI
        theme,
        toggleTheme,
        isSidebarCollapsed,
        setIsSidebarCollapsed,

        // Modal Control
        isNewTicketModalOpen,
        setIsNewTicketModalOpen,
        initialModalStatus,
        openNewTicketWithStatus,

        // Custom Coming Soon Alert
        showComingSoon,
      }}
    >
      {children}

      {/* Global Custom Coming Soon Modal */}
      <ComingSoonModal
        isOpen={comingSoonState.isOpen}
        onClose={() => setComingSoonState((prev) => ({ ...prev, isOpen: false }))}
        featureName={comingSoonState.featureName}
      />
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
