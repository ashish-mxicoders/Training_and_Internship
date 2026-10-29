'use client';

// =====================================================================
// Component: Filter Toolbar
// Modular search bar, status picker, advanced popover, and view toggle.
// =====================================================================

import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ArrowUpDown, Settings2, X, Check } from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { TicketStatus } from '@/types';
import { AdvancedFilterPopover } from '@/components/tickets/AdvancedFilterPopover';
import { ViewModeSwitcher } from '@/components/tickets/ViewModeSwitcher';

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

  // Close status dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 overflow-x-visible pb-1 sm:pb-0">
        {/* Table Specific Controls */}
        {activeViewMode === 'table' && (
          <>
            <button
              type="button"
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-xs font-medium bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
              <span>Board order</span>
            </button>

            <button
              type="button"
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-xs font-medium bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors whitespace-nowrap cursor-pointer"
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
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors whitespace-nowrap cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
            <span>{currentStatusLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {isStatusDropdownOpen && (
            <>
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
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer"
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

        {/* Advanced Filters Popover Sub-Component */}
        <AdvancedFilterPopover
          isOpen={isFilterPopoverOpen}
          onToggle={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
          onClose={() => setIsFilterPopoverOpen(false)}
          activeFilterCount={activeFilterCount}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          healthFilter={healthFilter}
          setHealthFilter={setHealthFilter}
          channelFilter={channelFilter}
          setChannelFilter={setChannelFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          assigneeFilter={assigneeFilter}
          setAssigneeFilter={setAssigneeFilter}
          clearAllFilters={clearAllFilters}
        />

        {/* View Mode Switcher Sub-Component */}
        <ViewModeSwitcher
          activeViewMode={activeViewMode}
          setActiveViewMode={setActiveViewMode}
        />
      </div>
    </div>
  );
}
