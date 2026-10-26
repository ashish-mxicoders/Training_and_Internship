'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  CircleDot,
  Clock,
  Check,
  Lock,
  Plus,
  MoreHorizontal,
  ArrowDownUp,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useTickets, ColumnSortType } from '@/lib/ticket-context';
import { Ticket, TicketStatus, TicketPriority, TicketHealth } from '@/types/ticket';
import { TicketCard } from './TicketCard';

export function KanbanBoard() {
  const {
    filteredTickets,
    setSelectedTicket,
    updateTicketStatus,
    setIsNewTicketModalOpen,
    openNewTicketWithStatus,
    columnSorts,
    setColumnSort,
  } = useTickets();

  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TicketStatus | null>(null);
  const [openMenuColumn, setOpenMenuColumn] = useState<TicketStatus | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close column dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuColumn(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const columns: Array<{
    id: TicketStatus;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'open',
      label: 'Open',
      icon: <CircleDot className="w-3.5 h-3.5 text-zinc-500" />,
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: <Clock className="w-3.5 h-3.5 text-zinc-500" />,
    },
    {
      id: 'resolved',
      label: 'Resolved',
      icon: <Check className="w-3.5 h-3.5 text-zinc-500" />,
    },
    {
      id: 'closed',
      label: 'Closed',
      icon: <Lock className="w-3.5 h-3.5 text-zinc-500" />,
    },
  ];

  const handleDragStart = (ticketId: string) => {
    setDraggedTicketId(ticketId);
  };

  const handleDragOver = (e: React.DragEvent, status: TicketStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (status: TicketStatus) => {
    if (draggedTicketId) {
      updateTicketStatus(draggedTicketId, status);
      setDraggedTicketId(null);
      setDragOverColumn(null);
    }
  };

  // Sort helper function
  const sortTickets = (tickets: Ticket[], sort: ColumnSortType): Ticket[] => {
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
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 pb-8 overflow-x-auto">
      {columns.map((col) => {
        const rawTickets = filteredTickets.filter((t) => t.status === col.id);
        const activeSort = columnSorts[col.id] || 'none';
        const columnTickets = sortTickets(rawTickets, activeSort);
        const isHovered = dragOverColumn === col.id;
        const isMenuOpen = openMenuColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(col.id)}
            className={`flex flex-col rounded-2xl bg-zinc-50/60 dark:bg-[#121622]/60 p-3 min-h-[500px] border transition-colors relative ${
              isHovered
                ? 'border-amber-400 bg-amber-50/20 dark:bg-amber-950/20'
                : 'border-transparent'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-1.5 mb-3">
              <div className="flex items-center gap-2">
                <span>{col.icon}</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {col.label}
                </span>
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                  {columnTickets.length}
                </span>
                {activeSort !== 'none' && (
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-semibold">
                    sorted
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 relative">
                <button
                  type="button"
                  onClick={() => openNewTicketWithStatus(col.id)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title={`Add ticket to ${col.label}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                {/* More options (...) Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenuColumn(isMenuOpen ? null : col.id)}
                    className={`p-1 rounded-lg transition-colors ${
                      isMenuOpen || activeSort !== 'none'
                        ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300'
                        : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800'
                    }`}
                    title="Sort and column options"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>

                  {/* Dropdown Menu for (...) */}
                  {isMenuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 top-full mt-1.5 w-56 bg-white dark:bg-[#181D29] border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl z-50 py-1.5 text-xs animate-in fade-in-50 zoom-in-95"
                    >
                      <div className="px-3 py-1 font-semibold text-[11px] text-zinc-400 uppercase tracking-wider">
                        Sort {col.label} By:
                      </div>

                      {/* Newest First */}
                      <button
                        type="button"
                        onClick={() => {
                          setColumnSort(col.id, 'newest');
                          setOpenMenuColumn(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors ${
                          activeSort === 'newest'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Newest date first</span>
                        </div>
                        {activeSort === 'newest' && <Check className="w-3.5 h-3.5 text-amber-500" />}
                      </button>

                      {/* Oldest First */}
                      <button
                        type="button"
                        onClick={() => {
                          setColumnSort(col.id, 'oldest');
                          setOpenMenuColumn(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors ${
                          activeSort === 'oldest'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Oldest date first</span>
                        </div>
                        {activeSort === 'oldest' && <Check className="w-3.5 h-3.5 text-amber-500" />}
                      </button>

                      {/* Highest Priority */}
                      <button
                        type="button"
                        onClick={() => {
                          setColumnSort(col.id, 'priority_high');
                          setOpenMenuColumn(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors ${
                          activeSort === 'priority_high'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Highest priority first</span>
                        </div>
                        {activeSort === 'priority_high' && <Check className="w-3.5 h-3.5 text-amber-500" />}
                      </button>

                      {/* Lowest Priority */}
                      <button
                        type="button"
                        onClick={() => {
                          setColumnSort(col.id, 'priority_low');
                          setOpenMenuColumn(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors ${
                          activeSort === 'priority_low'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ArrowDownUp className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Lowest priority first</span>
                        </div>
                        {activeSort === 'priority_low' && <Check className="w-3.5 h-3.5 text-amber-500" />}
                      </button>

                      {/* Health First */}
                      <button
                        type="button"
                        onClick={() => {
                          setColumnSort(col.id, 'health');
                          setOpenMenuColumn(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors ${
                          activeSort === 'health'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          <span>SLA Breached & Warning first</span>
                        </div>
                        {activeSort === 'health' && <Check className="w-3.5 h-3.5 text-amber-500" />}
                      </button>

                      {/* Reset sorting */}
                      {activeSort !== 'none' && (
                        <div className="pt-1 mt-1 border-t border-zinc-100 dark:border-zinc-800">
                          <button
                            type="button"
                            onClick={() => {
                              setColumnSort(col.id, 'none');
                              setOpenMenuColumn(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-zinc-500 hover:text-rose-600 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset to default order</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ticket Cards Stream */}
            <div className="flex-1 flex flex-col gap-3">
              {columnTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => setSelectedTicket(ticket)}
                  onDragStart={() => handleDragStart(ticket.id)}
                />
              ))}

              {columnTickets.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-xs text-zinc-400 dark:text-zinc-600">
                  <span>No tickets in {col.label}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
