'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Ticket as TicketIcon,
  User,
  UserX,
  Clock,
  AlertTriangle,
  Folder,
  ArrowUp,
  ArrowDown,
  Minus,
  CircleDashed,
  X,
} from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { TicketCategory, TicketPriority, ViewFilter } from '@/types/ticket';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    tickets,
    viewFilter,
    setViewFilter,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = useTickets();

  // Helper: applies filter, navigates to /tickets if on another page, and closes mobile drawer
  const handleSelect = (action: () => void) => {
    action();
    if (pathname !== '/tickets') {
      router.push('/tickets');
    }
    // Auto-close on mobile screens
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarCollapsed(true);
    }
  };

  // Calculate live badge counts
  const countMyTickets = tickets.filter((t) => t.assignee?.id === 'usr-1').length;
  const countUnassigned = tickets.filter((t) => !t.assignee).length;
  const countPastDue = tickets.filter((t) => t.isPastDue).length;
  const countEscalated = tickets.filter((t) => t.isEscalated).length;

  if (isSidebarCollapsed) {
    return null;
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Close Navigation"
        onClick={() => setIsSidebarCollapsed(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            setIsSidebarCollapsed(true);
          }
        }}
        className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity cursor-pointer touch-manipulation select-none"
      />

      <aside
        onClick={(e) => e.stopPropagation()}
        className="fixed md:static inset-y-0 left-0 z-50 md:z-auto w-72 sm:w-64 flex-shrink-0 bg-white dark:bg-[#151924] border-r border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between py-5 px-3 transition-colors h-full overflow-y-auto shadow-2xl md:shadow-none animate-in slide-in-from-left duration-150 md:animate-none"
      >
        <div className="space-y-6">
          {/* Mobile close button header */}
          <div className="md:hidden flex items-center justify-between px-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/60 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Navigation
            </span>
            <button
              type="button"
              aria-label="Close Navigation"
              onClick={(e) => {
                e.stopPropagation();
                setIsSidebarCollapsed(true);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-90 transition-transform cursor-pointer touch-manipulation"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* SECTION: VIEWS */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
              Views
            </div>
            <div className="space-y-0.5">
              {/* All Tickets */}
              <button
                type="button"
                onClick={() =>
                  handleSelect(() => {
                    setViewFilter('all');
                    setCategoryFilter('all');
                    setPriorityFilter('all');
                  })
                }
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl font-medium transition-colors ${
                  pathname === '/tickets' && viewFilter === 'all' && categoryFilter === 'all' && priorityFilter === 'all'
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <TicketIcon className="w-4 h-4 opacity-75" />
                  <span>All Tickets</span>
                </div>
              </button>

              {/* My Tickets */}
              <button
                type="button"
                onClick={() =>
                  handleSelect(() => setViewFilter(viewFilter === 'my' ? 'all' : 'my'))
                }
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl font-medium transition-colors ${
                  pathname === '/tickets' && viewFilter === 'my'
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 opacity-75" />
                  <span>My Tickets</span>
                </div>
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                  {countMyTickets || 6}
                </span>
              </button>

              {/* Unassigned */}
              <button
                type="button"
                onClick={() =>
                  handleSelect(() => setViewFilter(viewFilter === 'unassigned' ? 'all' : 'unassigned'))
                }
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl font-medium transition-colors ${
                  pathname === '/tickets' && viewFilter === 'unassigned'
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserX className="w-4 h-4 opacity-75" />
                  <span>Unassigned</span>
                </div>
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                  {countUnassigned || 3}
                </span>
              </button>

              {/* Past Due */}
              <button
                type="button"
                onClick={() =>
                  handleSelect(() => setViewFilter(viewFilter === 'past_due' ? 'all' : 'past_due'))
                }
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl font-medium transition-colors ${
                  pathname === '/tickets' && viewFilter === 'past_due'
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 opacity-75" />
                  <span>Past Due</span>
                </div>
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                  {countPastDue || 7}
                </span>
              </button>

              {/* Escalated */}
              <button
                type="button"
                onClick={() =>
                  handleSelect(() => setViewFilter(viewFilter === 'escalated' ? 'all' : 'escalated'))
                }
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl font-medium transition-colors ${
                  pathname === '/tickets' && viewFilter === 'escalated'
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 opacity-75" />
                  <span>Escalated</span>
                </div>
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                  {countEscalated || 5}
                </span>
              </button>
            </div>
          </div>

          {/* SECTION: CATEGORIES */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
              Categories
            </div>
            <div className="space-y-0.5">
              {[
                { id: 'billing', label: 'Billing' },
                { id: 'technical', label: 'Technical Issue' },
                { id: 'account', label: 'Account & Login' },
                { id: 'subscription', label: 'Subscription' },
                { id: 'other', label: 'Other' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    handleSelect(() =>
                      setCategoryFilter(categoryFilter === cat.id ? 'all' : (cat.id as TicketCategory))
                    )
                  }
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl font-medium transition-colors ${
                    pathname === '/tickets' && categoryFilter === cat.id
                      ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Folder className="w-4 h-4 opacity-70" />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION: PRIORITY */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
              Priority
            </div>
            <div className="space-y-0.5">
              {[
                {
                  id: 'urgent',
                  label: 'Urgent',
                  icon: <ArrowUp className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" />,
                },
                {
                  id: 'high',
                  label: 'High',
                  icon: <ArrowUp className="w-3.5 h-3.5 text-amber-500 stroke-[2.5]" />,
                },
                {
                  id: 'medium',
                  label: 'Medium',
                  icon: <Minus className="w-3.5 h-3.5 text-sky-500 stroke-[3]" />,
                },
                {
                  id: 'low',
                  label: 'Low',
                  icon: <ArrowDown className="w-3.5 h-3.5 text-zinc-500 stroke-[2.5]" />,
                },
                {
                  id: 'todo',
                  label: 'Todo',
                  icon: <CircleDashed className="w-3.5 h-3.5 text-zinc-400 stroke-[2]" />,
                },
              ].map((prio) => (
                <button
                  key={prio.id}
                  type="button"
                  onClick={() =>
                    handleSelect(() =>
                      setPriorityFilter(priorityFilter === prio.id ? 'all' : (prio.id as TicketPriority))
                    )
                  }
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl font-medium transition-colors ${
                    pathname === '/tickets' && priorityFilter === prio.id
                      ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <span className="w-4 flex items-center justify-center">{prio.icon}</span>
                  <span>{prio.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
