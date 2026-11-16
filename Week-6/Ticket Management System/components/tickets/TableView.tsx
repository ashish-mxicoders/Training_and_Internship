'use client';

// =====================================================================
// Component: Table View
// Tabular view of tickets with sorting, bulk selection, and actions.
// =====================================================================

import React, { useState } from 'react';
import { Trash2, CheckCircle2, ArrowUpDown } from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { Ticket } from '@/types';
import { TicketTableRow } from './table/TicketTableRow';

export function TableView() {
  const { filteredTickets, setSelectedTicket, updateTicketStatus, deleteTicket } = useTickets();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Ticket>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTickets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTickets.map((t) => t.id));
    }
  };

  const toggleSelectRow = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkResolve = () => {
    selectedIds.forEach((id) => updateTicketStatus(id, 'resolved'));
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => deleteTicket(id));
    setSelectedIds([]);
  };

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const handleSort = (field: keyof Ticket) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xs">
      {/* Bulk Action Header when items are selected */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 px-6 py-2.5 border-b border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
            {selectedIds.length} ticket{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkResolve}
              className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Resolved</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-50/70 dark:bg-[#121622]/60 text-zinc-500 dark:text-zinc-400 text-xs border-b border-zinc-200/80 dark:border-zinc-800/80">
            <tr>
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredTickets.length && filteredTickets.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-zinc-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
                />
              </th>
              <th
                onClick={() => handleSort('id')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200"
              >
                <div className="flex items-center gap-1">
                  <span># ID</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('subject')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200"
              >
                <div className="flex items-center gap-1">
                  <span>Subject</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200"
              >
                <span>Status</span>
              </th>
              <th
                onClick={() => handleSort('priority')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200"
              >
                <span>Priority</span>
              </th>
              <th className="py-3 px-3 font-semibold">Assignee</th>
              <th className="py-3 px-3 font-semibold">Category</th>
              <th className="py-3 px-3 font-semibold">Channel</th>
              <th className="py-3 px-4 font-semibold">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
            {sortedTickets.map((ticket) => (
              <TicketTableRow
                key={ticket.id}
                ticket={ticket}
                isSelected={selectedIds.includes(ticket.id)}
                onToggleSelect={(e) => toggleSelectRow(e, ticket.id)}
                onClick={() => setSelectedTicket(ticket)}
              />
            ))}

            {sortedTickets.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
                  No matching tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
