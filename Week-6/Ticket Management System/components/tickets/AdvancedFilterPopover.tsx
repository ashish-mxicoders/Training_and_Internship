'use client';

// =====================================================================
// Sub-Component: Advanced Filter Popover
// Multi-dimension filters: Priority, Health, Channel, Category, Assignee.
// =====================================================================

import React, { useRef, useEffect } from 'react';
import { SlidersHorizontal, RotateCcw, X } from 'lucide-react';
import {
  TicketCategory,
  TicketChannel,
  TicketHealth,
  TicketPriority,
} from '@/types';
import { TEAM_MEMBERS } from '@/lib/mock-data';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  activeFilterCount: number;
  priorityFilter: TicketPriority | 'all';
  setPriorityFilter: (p: TicketPriority | 'all') => void;
  healthFilter: TicketHealth | 'all';
  setHealthFilter: (h: TicketHealth | 'all') => void;
  channelFilter: TicketChannel | 'all';
  setChannelFilter: (c: TicketChannel | 'all') => void;
  categoryFilter: string | 'all';
  setCategoryFilter: (c: string | 'all') => void;
  assigneeFilter: string | 'all';
  setAssigneeFilter: (a: string | 'all') => void;
  clearAllFilters: () => void;
}

export function AdvancedFilterPopover({
  isOpen,
  onToggle,
  onClose,
  activeFilterCount,
  priorityFilter,
  setPriorityFilter,
  healthFilter,
  setHealthFilter,
  channelFilter,
  setChannelFilter,
  categoryFilter,
  setCategoryFilter,
  assigneeFilter,
  setAssigneeFilter,
  clearAllFilters,
}: Props) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={onToggle}
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

      {isOpen && (
        <>
          <div
            onClick={onClose}
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
                  onClick={onClose}
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

            {/* Apply Button */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

