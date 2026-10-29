'use client';

// =====================================================================
// Sub-Component: Ticket Table Row
// =====================================================================

import React from 'react';
import { Ticket } from '@/types';
import { DESIGN_TOKENS, CATEGORY_LABELS } from '@/lib/design-system';
import { TablePriorityBadge, TableChannelBadge } from './TableBadgeHelpers';

interface Props {
  ticket: Ticket;
  isSelected: boolean;
  onToggleSelect: (e: React.MouseEvent) => void;
  onClick: () => void;
}

export function TicketTableRow({ ticket, isSelected, onToggleSelect, onClick }: Props) {
  const statusStyle = DESIGN_TOKENS.colors.status[ticket.status];
  const healthStyle = DESIGN_TOKENS.colors.health[ticket.health];

  return (
    <tr
      onClick={onClick}
      className={`hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer ${
        isSelected ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''
      }`}
    >
      {/* Checkbox */}
      <td className="py-3.5 px-4" onClick={onToggleSelect}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className="rounded border-zinc-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
        />
      </td>

      {/* ID */}
      <td className="py-3.5 px-3 font-mono text-xs text-zinc-400 dark:text-zinc-500 font-medium">
        #{ticket.id}
      </td>

      {/* Subject */}
      <td className="py-3.5 px-3 font-medium text-zinc-900 dark:text-zinc-100 max-w-xs md:max-w-md truncate">
        {ticket.subject}
      </td>

      {/* Status Pill */}
      <td className="py-3.5 px-3">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
        >
          {statusStyle.label}
        </span>
      </td>

      {/* Priority */}
      <td className="py-3.5 px-3">
        <TablePriorityBadge priority={ticket.priority} />
      </td>

      {/* Assignee */}
      <td className="py-3.5 px-3">
        <div className="flex items-center gap-2">
          {ticket.assignee ? (
            <>
              {ticket.assignee.avatar ? (
                <img
                  src={ticket.assignee.avatar}
                  alt={ticket.assignee.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 flex items-center justify-center">
                  {ticket.assignee.initials}
                </div>
              )}
              <span className="text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                {ticket.assignee.name}
              </span>
            </>
          ) : (
            <div className="flex items-center gap-2 text-zinc-400">
              <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] flex items-center justify-center ring-1 ring-dashed ring-zinc-300">
                --
              </div>
              <span className="text-xs">Unassigned</span>
            </div>
          )}
        </div>
      </td>

      {/* Category */}
      <td className="py-3.5 px-3 text-xs text-zinc-600 dark:text-zinc-400 capitalize">
        {CATEGORY_LABELS[ticket.category] || ticket.category}
      </td>

      {/* Channel */}
      <td className="py-3.5 px-3">
        <TableChannelBadge channel={ticket.channel} />
      </td>

      {/* Health */}
      <td className="py-3.5 px-4">
        <div className="flex flex-col items-start gap-1">
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${healthStyle.bg} ${healthStyle.text} ${healthStyle.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${healthStyle.dot}`} />
            <span>{healthStyle.label}</span>
          </div>
          {ticket.isEscalated && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 whitespace-nowrap"
              title="Escalated Ticket"
            >
              ⚠️ Escalated
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

