'use client';

// =====================================================================
// Sub-Component: Ticket Detail Sidebar
// Ticket metadata, property selectors, customer info, and SLA tracking.
// =====================================================================

import React from 'react';
import { ChevronDown, Clock, User, Building, Mail } from 'lucide-react';
import { Ticket, TicketPriority, TicketStatus } from '@/types';
import { TEAM_MEMBERS } from '@/lib/mock-data';
import { CATEGORY_LABELS } from '@/lib/design-system';

interface Props {
  ticket: Ticket;
  onUpdateStatus: (status: TicketStatus, isEscalated?: boolean) => void;
  onUpdatePriority: (priority: TicketPriority) => void;
  onUpdateAssignee: (assigneeId: string) => void;
}

export function TicketDetailSidebar({
  ticket,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateAssignee,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Quick Properties */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Ticket Properties
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-zinc-400 block mb-1">Status</label>
            <div className="relative">
              <select
                value={ticket.isEscalated ? 'escalated' : ticket.status}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'escalated') {
                    onUpdateStatus(ticket.status, true);
                  } else {
                    onUpdateStatus(val as TicketStatus, false);
                  }
                }}
                className="w-full appearance-none py-2 pl-3 pr-8 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-hidden"
              >
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="escalated">⚠️ Escalated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">Priority</label>
            <div className="relative">
              <select
                value={ticket.priority}
                onChange={(e) => onUpdatePriority(e.target.value as TicketPriority)}
                className="w-full appearance-none py-2 pl-3 pr-8 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium text-zinc-800 dark:text-zinc-200 capitalize cursor-pointer focus:outline-hidden"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="todo">Todo</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">Assignee</label>
            <div className="relative">
              <select
                value={ticket.assignee?.id || 'unassigned'}
                onChange={(e) => onUpdateAssignee(e.target.value)}
                className="w-full appearance-none py-2 pl-3 pr-8 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-hidden"
              >
                <option value="unassigned">Unassigned</option>
                {Object.values(TEAM_MEMBERS).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">Category</label>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 font-medium">
              {CATEGORY_LABELS[ticket.category] || ticket.category}
            </div>
          </div>
        </div>
      </div>

      {/* SLA Countdown Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
          <span>SLA & Due Date</span>
          <Clock className="w-3.5 h-3.5 text-amber-500" />
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-400">Resolution Due:</span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {ticket.dueDate || 'No Due Date'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-400">Channel:</span>
            <span className="font-semibold capitalize text-zinc-700 dark:text-zinc-300">
              {ticket.channel}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-zinc-400">Health Status:</span>
            <span className="font-semibold capitalize text-zinc-700 dark:text-zinc-300">
              {ticket.health.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Customer Profile
        </h3>

        <div className="flex items-center gap-3">
          {ticket.customer.avatar ? (
            <img
              src={ticket.customer.avatar}
              alt={ticket.customer.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 font-bold text-sm flex items-center justify-center">
              {ticket.customer.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {ticket.customer.name}
            </h4>
            <p className="text-xs text-zinc-400">{ticket.customer.company}</p>
          </div>
        </div>

        <div className="space-y-2 pt-2 text-xs border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{ticket.customer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Building className="w-3.5 h-3.5 shrink-0" />
            <span>{ticket.customer.company}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

