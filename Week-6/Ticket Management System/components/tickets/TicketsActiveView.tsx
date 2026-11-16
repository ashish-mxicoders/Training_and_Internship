'use client';

// =====================================================================
// Isolated Client Component: Tickets Active View
// Switches between Kanban and Table view based on client context state.
// =====================================================================

import React from 'react';
import { useTickets } from '@/lib/ticket-context';
import { KanbanBoard } from '@/components/tickets/KanbanBoard';
import { TableView } from '@/components/tickets/TableView';

export function TicketsActiveView() {
  const { activeViewMode } = useTickets();

  return activeViewMode === 'kanban' ? <KanbanBoard /> : <TableView />;
}

