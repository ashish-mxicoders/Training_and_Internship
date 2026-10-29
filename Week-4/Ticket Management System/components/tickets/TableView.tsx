'use client';

import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Minus,
  CircleDashed,
  Mail,
  MessageSquare,
  Globe,
  Hash,
  Check,
  Trash2,
  CheckCircle2,
  ArrowUpDown,
} from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { Ticket, TicketStatus, TicketPriority, TicketChannel } from '@/types/ticket';
import { DESIGN_TOKENS, CATEGORY_LABELS } from '@/lib/design-system';

export function TableView() {
  const { filteredTickets, setSelectedTicket, updateTicketStatus, deleteTicket } = useTickets();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Ticket>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle select all
  const handleSelectAll = () => {
    if (selectedIds.length === filteredTickets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTickets.map((t) => t.id));
    }
  };

  // Toggle single row selection
  const toggleSelectRow = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkResolve = () => {
    selectedIds.forEach((id) => updateTicketStatus(id, 'resolved'));
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => deleteTicket(id));
    setSelectedIds([]);
  };

  // Sorting
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

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

  // Render helpers
  const renderPriority = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Urgent</span>
          </div>
        );
      case 'high':
        return (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>High</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-medium">
            <Minus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Medium</span>
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
            <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Low</span>
          </div>
        );
      case 'todo':
        return (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <CircleDashed className="w-3.5 h-3.5 stroke-[2]" />
            <span>Todo</span>
          </div>
        );
    }
  };

  const renderChannel = (channel: TicketChannel) => {
    switch (channel) {
      case 'email':
        return (
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <span>Email</span>
          </div>
        );
      case 'chat':
        return (
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
            <span>Chat</span>
          </div>
        );
      case 'web':
        return (
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>Web</span>
          </div>
        );
      case 'slack':
        return (
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <Hash className="w-3.5 h-3.5 text-zinc-400" />
            <span>Slack</span>
          </div>
        );
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
              className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Resolved</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
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
            {sortedTickets.map((ticket) => {
              const isSelected = selectedIds.includes(ticket.id);
              const statusStyle = DESIGN_TOKENS.colors.status[ticket.status];
              const healthStyle = DESIGN_TOKENS.colors.health[ticket.health];

              return (
                <tr
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer ${
                    isSelected ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-4" onClick={(e) => toggleSelectRow(e, ticket.id)}>
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
                  <td className="py-3.5 px-3">{renderPriority(ticket.priority)}</td>

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
                  <td className="py-3.5 px-3">{renderChannel(ticket.channel)}</td>

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
            })}

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
