'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TicketStats,
  TicketChannel,
  TicketHealth,
  ViewFilter,
  TicketComment,
} from '@/types/ticket';
import { INITIAL_TICKETS, CURRENT_USER, TEAM_MEMBERS } from '@/lib/mock-data';

const STORAGE_KEY = 'helpdesk_tickets_v1';
const THEME_KEY = 'helpdesk_theme_v1';

export type ColumnSortType =
  | 'none'
  | 'newest'
  | 'oldest'
  | 'priority_high'
  | 'priority_low'
  | 'health';

interface TicketContextType {
  tickets: Ticket[];
  filteredTickets: Ticket[];
  stats: TicketStats;
  selectedTicket: Ticket | null;
  setSelectedTicket: (ticket: Ticket | null) => void;
  // Filters
  viewFilter: ViewFilter;
  setViewFilter: (view: ViewFilter) => void;
  categoryFilter: TicketCategory | 'all';
  setCategoryFilter: (category: TicketCategory | 'all') => void;
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
  addTicket: (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => Ticket;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  addComment: (ticketId: string, content: string, isInternal: boolean) => void;
  deleteTicket: (id: string) => void;
  resetToDefaults: () => void;
  // Layout & UI
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isNewTicketModalOpen: boolean;
  setIsNewTicketModalOpen: (open: boolean) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter state
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [healthFilter, setHealthFilter] = useState<TicketHealth | 'all'>('all');
  const [channelFilter, setChannelFilter] = useState<TicketChannel | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeViewMode, setActiveViewMode] = useState<'kanban' | 'table'>('kanban');

  // Column Sort state
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

  // UI state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  // Initialize from sessionStorage and localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedTickets = window.sessionStorage.getItem(STORAGE_KEY);
        if (savedTickets) {
          setTickets(JSON.parse(savedTickets));
        }
        const savedTheme = window.localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          setTheme('light');
        }
        if (window.innerWidth < 768) {
          setIsSidebarCollapsed(true);
        }
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    setIsLoaded(true);
  }, []);

  // Sync theme changes to <html> element and localStorage
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      try {
        window.localStorage.setItem(THEME_KEY, theme);
      } catch {}
    }
  }, [theme]);

  // Save tickets to sessionStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.warn('Failed saving tickets to sessionStorage', e);
    }
  }, [tickets, isLoaded]);

  // Theme toggle
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Clear all active filters
  const clearAllFilters = () => {
    setViewFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setStatusFilter('all');
    setHealthFilter('all');
    setChannelFilter('all');
    setAssigneeFilter('all');
    setSearchQuery('');
  };

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

  // Add Ticket
  const addTicket = (
    newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>
  ): Ticket => {
    const nextNumber = tickets.length + 1;
    const formattedId = `#-0${nextNumber < 10 ? '0' + nextNumber : nextNumber}`;
    const today = new Date().toISOString().split('T')[0];

    const ticket: Ticket = {
      ...newTicketData,
      id: formattedId,
      createdAt: today,
      updatedAt: today,
      comments: [],
    };

    setTickets((prev) => [ticket, ...prev]);
    return ticket;
  };

  // Update Status
  const updateTicketStatus = (id: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : t
      )
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) => (prev ? { ...prev, status } : null));
    }
  };

  // Update Ticket Generic
  const updateTicket = (id: string, updates: Partial<Ticket>) => {
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
  };

  // Add Comment
  const addComment = (ticketId: string, content: string, isInternal: boolean) => {
    const newComment: TicketComment = {
      id: `c-${Date.now()}`,
      authorName: CURRENT_USER.name,
      authorAvatar: CURRENT_USER.avatar,
      authorInitials: CURRENT_USER.initials,
      isInternal,
      content,
      timestamp: 'Just now',
    };

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
  };

  // Delete Ticket
  const deleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket(null);
    }
  };

  // Reset to Defaults
  const resetToDefaults = () => {
    setTickets(INITIAL_TICKETS);
    clearAllFilters();
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
    } catch {}
  };

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // View filter
      if (viewFilter === 'my' && ticket.assignee?.id !== CURRENT_USER.id) {
        return false;
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
    viewFilter,
    categoryFilter,
    priorityFilter,
    statusFilter,
    healthFilter,
    channelFilter,
    assigneeFilter,
    searchQuery,
  ]);

  // Statistics
  const stats: TicketStats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === 'open').length;
    const pending = tickets.filter((t) => t.status === 'pending').length;
    const resolved = tickets.filter((t) => t.status === 'resolved').length;
    const closed = tickets.filter((t) => t.status === 'closed').length;

    return {
      total,
      open,
      pending,
      resolved,
      closed,
      totalChangePct: 17.6,
      openChangePct: -20.0,
      pendingChangePct: -16.7,
      resolvedChangePct: 100.0,
    };
  }, [tickets]);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        filteredTickets,
        stats,
        selectedTicket,
        setSelectedTicket,
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
        resetToDefaults,
        theme,
        toggleTheme,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isNewTicketModalOpen,
        setIsNewTicketModalOpen,
      }}
    >
      {children}
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
