'use client';

// =====================================================================
// Ticket Context & Global State Management
// Clean, modular React Context connecting UI with Next.js Server Actions.
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
  AppUser,
  CategoryItem,
  ColumnSortType,
  CreateTicketInput,
  Ticket,
  TicketChannel,
  TicketHealth,
  TicketPriority,
  TicketStats,
  TicketStatus,
  UpdateTicketInput,
  ViewFilter,
} from '@/types';
import { INITIAL_TICKETS } from '@/lib/mock-data';
import { ComingSoonModal } from '@/components/ui/CustomModal';
import {
  computeFilteredTickets,
  computeTicketStats,
  countActiveFilters,
} from '@/lib/ticket-filters';
import { logoutAction } from '@/app/actions/auth';
import {
  addCommentAction,
  createTicketAction,
  deleteTicketAction,
  updateTicketAction,
  updateTicketStatusAction,
} from '@/app/actions/tickets';
import { addCategoryAction } from '@/app/actions/categories';

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

  // Actions powered by Next.js Server Actions
  addTicket: (newTicket: CreateTicketInput) => Promise<Ticket>;
  updateTicketStatus: (id: string, status: TicketStatus) => Promise<void>;
  updateTicket: (id: string, updates: UpdateTicketInput) => Promise<void>;
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

  // Modal Control
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
  // 1. Current Logged-in User
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  // 2. Tickets & Selected Ticket State
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 3. Categories State
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
    setColumnSorts((prev) => ({ ...prev, [status]: sort }));
  };

  // 6. UI & Modals State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [initialModalStatus, setInitialModalStatus] = useState<TicketStatus>('open');

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

  const openNewTicketWithStatus = useCallback((status: TicketStatus) => {
    setInitialModalStatus(status);
    setIsNewTicketModalOpen(true);
  }, []);

  // 7. Load Categories
  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.categories?.length > 0) {
          setCategories(data.categories);
        }
      }
    } catch (_error) {
      // Fallback to defaults
    }
  }, []);

  // 8. Fetch Tickets from Database
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
      // Graceful fallback
    }
  }, []);

  // 9. Initial Load on Client Mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = window.localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
        if (savedTheme) setTheme(savedTheme);
        if (window.innerWidth < 768) setIsSidebarCollapsed(true);
      }
    } catch (e) {}

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
    setTimeout(() => {
      refreshTickets();
    }, 100);
  }, [refreshTickets]);

  const logoutUser = useCallback(async () => {
    await logoutAction();
    setCurrentUser(null);
    setTickets([]);
  }, []);

  const switchUserRole = useCallback((role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setCurrentUser({
        id: 'usr-1',
        name: 'Jason Duong',
        email: 'jason.duong@acme.io',
        role: 'admin',
        avatar: '/images/avatar-jason.jpg',
        initials: 'JD',
        company: 'Acme Support Desk',
      });
    } else {
      setCurrentUser({
        id: 'cust-1',
        name: 'Sarah Jenkins',
        email: 'customer@client.com',
        role: 'customer',
        initials: 'SJ',
        company: 'Pine & Peak Inc.',
      });
    }
    setTimeout(() => {
      refreshTickets();
    }, 100);
  }, [refreshTickets]);

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

  // Action: Add Ticket (Server Action with Optimistic UI)
  const addTicket = async (newTicketData: CreateTicketInput): Promise<Ticket> => {
    const tempId = String(Date.now());
    const today = new Date().toISOString().split('T')[0];

    const localTicket: Ticket = {
      id: tempId,
      subject: newTicketData.subject,
      description: newTicketData.description,
      status: newTicketData.status || 'open',
      priority: newTicketData.priority || 'medium',
      category: (newTicketData.category as any) || 'technical',
      channel: newTicketData.channel || 'web',
      health: newTicketData.health || 'on_track',
      dueDate: newTicketData.dueDate || '',
      createdAt: today,
      updatedAt: today,
      isEscalated: newTicketData.isEscalated || false,
      tags: newTicketData.tags || [],
      customer: {
        name: newTicketData.customerName || currentUser?.name || 'Customer',
        company: newTicketData.companyName || currentUser?.company || 'Organization',
        email: newTicketData.customerEmail || currentUser?.email || 'client@example.com',
      },
      comments: [],
    };

    setTickets((prev) => [localTicket, ...prev]);

    try {
      const res = await createTicketAction(newTicketData);
      if (res.success && res.data) {
        setTickets((prev) => prev.map((t) => (t.id === tempId ? res.data! : t)));
        return res.data;
      }
    } catch (_err) {}

    return localTicket;
  };

  // Action: Update Status (Server Action)
  const updateTicketStatus = async (id: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString().split('T')[0] } : t
      )
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) => (prev ? { ...prev, status } : null));
    }
    await updateTicketStatusAction(id, status);
  };

  // Action: Update Ticket fields (Server Action)
  const updateTicket = async (id: string, updates: UpdateTicketInput) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : t
      )
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) => (prev ? { ...prev, ...updates } : null));
    }
    await updateTicketAction(id, updates);
  };

  // Action: Add Comment (Server Action)
  const addComment = async (ticketId: string, content: string) => {
    const res = await addCommentAction(ticketId, content);
    if (res.success && res.data) {
      const comment = res.data;
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                comments: [...t.comments, comment],
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : t
        )
      );
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket((prev) =>
          prev ? { ...prev, comments: [...prev.comments, comment] } : null
        );
      }
    }
  };

  // Action: Delete Ticket (Server Action)
  const deleteTicket = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (currentUser?.role === 'customer') {
      return { success: false, error: 'Customers are not permitted to delete tickets.' };
    }

    setTickets((prev) => prev.filter((t) => t.id !== id));
    if (selectedTicket?.id === id) setSelectedTicket(null);

    const res = await deleteTicketAction(id);
    return { success: res.success, error: res.error };
  };

  // Action: Add Category (Server Action)
  const addCategory = async (name: string): Promise<boolean> => {
    const res = await addCategoryAction(name);
    if (res.success) {
      await loadCategories();
      return true;
    }
    return false;
  };

  // Compute Filtered Tickets & Stats using pure helper functions
  const filterCriteria = useMemo(
    () => ({
      viewFilter,
      categoryFilter,
      priorityFilter,
      statusFilter,
      healthFilter,
      channelFilter,
      assigneeFilter,
      searchQuery,
    }),
    [
      viewFilter,
      categoryFilter,
      priorityFilter,
      statusFilter,
      healthFilter,
      channelFilter,
      assigneeFilter,
      searchQuery,
    ]
  );

  const filteredTickets = useMemo(
    () => computeFilteredTickets(tickets, currentUser, filterCriteria),
    [tickets, currentUser, filterCriteria]
  );

  const stats = useMemo(
    () => computeTicketStats(tickets, currentUser),
    [tickets, currentUser]
  );

  const activeFilterCount = useMemo(
    () => countActiveFilters(filterCriteria),
    [filterCriteria]
  );

  return (
    <TicketContext.Provider
      value={{
        tickets,
        filteredTickets,
        selectedTicket,
        setSelectedTicket,
        stats,
        isLoaded,
        currentUser,
        loginUser,
        logoutUser,
        switchUserRole,
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
        columnSorts,
        setColumnSort,
        addTicket,
        updateTicketStatus,
        updateTicket,
        addComment,
        deleteTicket,
        refreshTickets,
        categories,
        addCategory,
        theme,
        toggleTheme,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isNewTicketModalOpen,
        setIsNewTicketModalOpen,
        initialModalStatus,
        openNewTicketWithStatus,
        showComingSoon,
      }}
    >
      {children}
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
