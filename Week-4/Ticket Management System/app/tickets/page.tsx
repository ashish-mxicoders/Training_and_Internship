'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { KpiCardGrid } from '@/components/tickets/KpiCardGrid';
import { FilterToolbar } from '@/components/tickets/FilterToolbar';
import { KanbanBoard } from '@/components/tickets/KanbanBoard';
import { TableView } from '@/components/tickets/TableView';

export default function TicketsPage() {
  const { activeViewMode, setIsNewTicketModalOpen } = useTickets();

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Tickets
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* New Ticket Primary Button */}
          <button
            type="button"
            onClick={() => setIsNewTicketModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-500 text-zinc-950 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <KpiCardGrid />

      {/* Filter and Search Bar */}
      <FilterToolbar />

      {/* Active View (Kanban Board vs Table View) */}
      {activeViewMode === 'kanban' ? <KanbanBoard /> : <TableView />}
    </div>
  );
}
