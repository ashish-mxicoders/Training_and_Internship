'use client';

// =====================================================================
// Sub-Component: Ticket Detail Header
// Navigation, ID badge, title, and quick admin actions.
// =====================================================================

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle2, Trash2 } from 'lucide-react';
import { AppUser, Ticket } from '@/types';
import { DESIGN_TOKENS } from '@/lib/design-system';

interface Props {
  ticket: Ticket;
  currentUser: AppUser | null;
  onToggleResolved: () => void;
  onRequestDelete: () => void;
}

export function TicketDetailHeader({
  ticket,
  currentUser,
  onToggleResolved,
  onRequestDelete,
}: Props) {
  const healthStyle = DESIGN_TOKENS.colors.health[ticket.health];
  const isAdmin = currentUser?.role !== 'customer';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
      <div className="flex items-center gap-3">
        <Link
          href="/tickets"
          className="p-2 rounded-xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          title="Back to Tickets Board"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-zinc-400 font-semibold">#{ticket.id}</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${healthStyle.bg} ${healthStyle.text} ${healthStyle.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${healthStyle.dot}`} />
              {healthStyle.label}
            </span>
            {ticket.isEscalated && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                ⚠️ Escalated
              </span>
            )}
            {ticket.dueDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                <Calendar className="w-3 h-3 text-zinc-400" />
                <span>Due: {ticket.dueDate}</span>
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:white mt-1">
            {ticket.subject}
          </h1>
        </div>
      </div>

      {/* Right Section: Created Date + Actions */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="text-[11px] text-zinc-400 block font-medium">Created On</span>
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {ticket.createdAt || 'Today'}
          </span>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleResolved}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                ticket.status === 'resolved'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{ticket.status === 'resolved' ? 'Reopen Ticket' : 'Mark Resolved'}</span>
            </button>

            <button
              onClick={onRequestDelete}
              className="p-2 text-zinc-400 hover:text-rose-600 bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Delete Ticket"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

