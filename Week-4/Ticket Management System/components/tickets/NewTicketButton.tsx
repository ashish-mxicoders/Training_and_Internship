'use client';

// =====================================================================
// Isolated Client Component: New Ticket Button
// Pushes client-side boundary down to just the interactive button.
// =====================================================================

import React from 'react';
import { Plus } from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';

export function NewTicketButton() {
  const { setIsNewTicketModalOpen } = useTickets();

  return (
    <button
      type="button"
      onClick={() => setIsNewTicketModalOpen(true)}
      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-500 text-zinc-950 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
    >
      <Plus className="w-4 h-4 stroke-[2.5]" />
      <span>New Ticket</span>
    </button>
  );
}

