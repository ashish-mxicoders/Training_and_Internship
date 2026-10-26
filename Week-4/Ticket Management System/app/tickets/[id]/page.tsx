'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Send,
  Building,
  User,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Share2,
} from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { TicketStatus, TicketPriority } from '@/types/ticket';
import { DESIGN_TOKENS, CATEGORY_LABELS } from '@/lib/design-system';
import { TEAM_MEMBERS } from '@/lib/mock-data';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { tickets, updateTicketStatus, updateTicket, addComment, deleteTicket } = useTickets();

  const ticketIdParam = params.id as string;
  // Can be formatted like '001' or '#-001'
  const normalizedId = ticketIdParam.startsWith('#-') ? ticketIdParam : `#-0${ticketIdParam.replace(/^0+/, '')}`;

  const ticket = tickets.find(
    (t) =>
      t.id === normalizedId ||
      t.id.endsWith(ticketIdParam) ||
      t.id.replace('#-', '') === ticketIdParam
  );

  const [commentInput, setCommentInput] = useState('');

  if (!ticket) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
          Ticket Not Found
        </h2>
        <p className="text-sm text-zinc-500">
          The requested ticket ID does not exist or was deleted.
        </p>
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-zinc-950 text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </Link>
      </div>
    );
  }

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(ticket.id, commentInput.trim(), false);
    setCommentInput('');
  };

  const statusStyle = DESIGN_TOKENS.colors.status[ticket.status];
  const healthStyle = DESIGN_TOKENS.colors.health[ticket.health];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation Bar */}
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
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-400 font-semibold">{ticket.id}</span>
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
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1">
              {ticket.subject}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              updateTicketStatus(ticket.id, ticket.status === 'resolved' ? 'open' : 'resolved');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              ticket.status === 'resolved'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{ticket.status === 'resolved' ? 'Reopen Ticket' : 'Mark Resolved'}</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Delete this ticket?')) {
                deleteTicket(ticket.id);
                router.push('/tickets');
              }
            }}
            className="p-2 text-zinc-400 hover:text-rose-600 bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Delete Ticket"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Conversation Stream + Right Metadata Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Ticket description & Conversation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Description Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Issue Description
            </h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {ticket.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {ticket.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-1">
              Activity History ({ticket.comments.length} updates)
            </h3>

            {ticket.comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#151924] transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    {comment.authorAvatar ? (
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-200"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center justify-center">
                        {comment.authorInitials}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                      {comment.authorName}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 pl-8 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))}

            {ticket.comments.length === 0 && (
              <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400">
                No comments or updates yet. Use the response box below to post a response.
              </div>
            )}
          </div>

          {/* Response Form */}
          <form
            onSubmit={handlePostReply}
            className="p-5 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3"
          >
            <textarea
              rows={4}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder={`Write a response to ${ticket.customer?.name || 'customer'}...`}
              className="w-full p-3.5 text-sm bg-zinc-50 dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-hidden resize-none"
            />

            <div className="flex items-center justify-end pt-1">
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-zinc-950 font-semibold text-xs rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Response</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Metadata & Customer Card */}
        <div className="space-y-6">
          {/* Quick Properties */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Ticket Properties
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Status</label>
                <select
                  value={ticket.isEscalated ? 'escalated' : ticket.status}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'escalated') {
                      updateTicket(ticket.id, { isEscalated: true });
                    } else {
                      updateTicket(ticket.id, { status: val as TicketStatus, isEscalated: false });
                    }
                  }}
                  className="w-full py-2 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium text-zinc-800 dark:text-zinc-200"
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="escalated">⚠️ Escalated</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Priority</label>
                <select
                  value={ticket.priority}
                  onChange={(e) => updateTicket(ticket.id, { priority: e.target.value as TicketPriority })}
                  className="w-full py-2 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium text-zinc-800 dark:text-zinc-200 capitalize"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="todo">Todo</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Assignee</label>
                <select
                  value={ticket.assignee?.id || 'unassigned'}
                  onChange={(e) => {
                    const member = Object.values(TEAM_MEMBERS).find((m) => m.id === e.target.value);
                    updateTicket(ticket.id, { assignee: member || undefined });
                  }}
                  className="w-full py-2 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium text-zinc-800 dark:text-zinc-200"
                >
                  <option value="unassigned">Unassigned</option>
                  {Object.values(TEAM_MEMBERS).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between py-1">
                <span className="text-zinc-400">Category</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {CATEGORY_LABELS[ticket.category]}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Channel</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 capitalize">
                  {ticket.channel}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Created Date</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {ticket.createdAt}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Target Due Date</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {ticket.dueDate}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Organization Profile */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Customer Account
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center">
                {ticket.customer.company.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {ticket.customer.company}
                </h4>
                <p className="text-xs text-zinc-400">
                  {ticket.customer.tier} Tier Contract
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>Contact: {ticket.customer.name}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span>{ticket.customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>SLA Target: 4h Resolution</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
