'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Columns3,
  Table2,
  ArrowUpDown,
  Settings2,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { TicketCategory, TicketChannel, TicketHealth, TicketPriority, TicketStatus } from '@/types/ticket';
import { TEAM_MEMBERS } from '@/lib/mock-data';

export function FilterToolbar() {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    healthFilter,
    setHealthFilter,
    channelFilter,
    setChannelFilter,
    assigneeFilter,
    setAssigneeFilter,
    clearAllFilters,
    activeFilterCount,
    activeViewMode,
    setActiveViewMode,
  } = useTickets();

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterPopoverOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusOptions: Array<{ id: TicketStatus | 'all'; label: string }> = [
    { id: 'all', label: 'All Statuses' },
    { id: 'open', label: 'Open' },
    { id: 'pending', label: 'Pending' },
    { id: 'resolved', label: 'Resolved' },
    { id: 'closed', label: 'Closed' },
  ];

  const currentStatusLabel =
    statusOptions.find((o) => o.id === statusFilter)?.label || 'All Statuses';

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 relative">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        <input
          id="main-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tickets by subject, customer, or ID..."
          className="w-full pl-10 pr-9 py-2.5 text-sm bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 overflow-x-visible pb-1 sm:pb-0">
        {/* Table Specific Controls (shown when table mode is active) */}
        {activeViewMode === 'table' && (
          <>
            <button
              type="button"
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-xs font-medium bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors whitespace-nowrap"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
              <span>Board order</span>
            </button>

            <button
              type="button"
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-xs font-medium bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors whitespace-nowrap"
            >
              <Settings2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>Table options</span>
            </button>
          </>
        )}

        {/* Status Dropdown Filter */}
        <div className="relative" ref={statusRef}>
          <button
            type="button"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
            <span>{currentStatusLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {isStatusDropdownOpen && (
            <>
              {/* Mobile overlay to close status dropdown */}
              <div
                onClick={() => setIsStatusDropdownOpen(false)}
                className="fixed inset-0 z-40 sm:hidden"
              />
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white dark:bg-[#181D29] border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 py-1">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setStatusFilter(opt.id);
                      setIsStatusDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-colors"
                  >
                    <span>{opt.label}</span>
                    {statusFilter === opt.id && (
                      <Check className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Rich Filters Popover Button [🎛️] */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
            className={`p-2 text-xs font-medium border rounded-xl transition-all relative ${
              activeFilterCount > 0
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-700 dark:text-amber-300'
                : 'bg-white dark:bg-[#151924] border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
            title="Open comprehensive filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center shadow-xs">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Filters Modal / Popover */}
          {isFilterPopoverOpen && (
            <>
              {/* Mobile backdrop for filters modal */}
              <div
                onClick={() => setIsFilterPopoverOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 sm:hidden backdrop-blur-2xs cursor-pointer touch-manipulation"
              />

              <div className="fixed inset-x-3 top-20 max-w-sm mx-auto sm:max-w-none sm:mx-0 sm:inset-auto sm:absolute sm:right-0 sm:top-full sm:mt-1.5 sm:w-96 bg-white dark:bg-[#181D29] border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 p-4 space-y-4 max-h-[80vh] overflow-y-auto animate-in fade-in-50 zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                      Filter Tickets
                    </span>
                    {activeFilterCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        {activeFilterCount} active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-rose-600 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset all</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFilterPopoverOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Close filters"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              {/* Priority Filter */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  Priority
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'urgent', label: 'Urgent' },
                    { id: 'high', label: 'High' },
                    { id: 'medium', label: 'Medium' },
                    { id: 'low', label: 'Low' },
                    { id: 'todo', label: 'Todo' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriorityFilter(p.id as TicketPriority | 'all')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition-colors ${
                        priorityFilter === p.id
                          ? 'bg-amber-400 text-black border-amber-500 font-semibold'
                          : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/60 hover:bg-zinc-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Health SLA Filter */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  Health SLA
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Health' },
                    { id: 'on_track', label: '● On Track' },
                    { id: 'warning', label: '● Warning' },
                    { id: 'breached', label: '● Breached' },
                  ].map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setHealthFilter(h.id as TicketHealth | 'all')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition-colors ${
                        healthFilter === h.id
                          ? 'bg-amber-400 text-black border-amber-500 font-semibold'
                          : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/60 hover:bg-zinc-100'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channel Filter */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  Channel Source
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'email', label: 'Email' },
                    { id: 'chat', label: 'Chat' },
                    { id: 'slack', label: 'Slack' },
                    { id: 'web', label: 'Web' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setChannelFilter(c.id as TicketChannel | 'all')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition-colors ${
                        channelFilter === c.id
                          ? 'bg-amber-400 text-black border-amber-500 font-semibold'
                          : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/60 hover:bg-zinc-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as TicketCategory | 'all')}
                  className="w-full py-1.5 px-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
                >
                  <option value="all">All Categories</option>
                  <option value="billing">Billing</option>
                  <option value="technical">Technical Issue</option>
                  <option value="account">Account & Login</option>
                  <option value="subscription">Subscription</option>
                  <option value="access">Access</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Assignee Filter */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  Assignee
                </label>
                <select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="w-full py-1.5 px-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
                >
                  <option value="all">All Assignees</option>
                  <option value="unassigned">Unassigned</option>
                  {Object.values(TEAM_MEMBERS).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Apply / Close Button */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsFilterPopoverOpen(false)}
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-black text-xs font-semibold rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </>
        )}
        </div>

        {/* View Switchers (Board vs Table) */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => setActiveViewMode('kanban')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeViewMode === 'kanban'
                ? 'bg-white dark:bg-[#151924] text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
            title="Kanban Board View"
          >
            <Columns3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeViewMode === 'table'
                ? 'bg-white dark:bg-[#151924] text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
            title="Table List View"
          >
            <Table2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
