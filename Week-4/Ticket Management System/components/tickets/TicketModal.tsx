'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Send,
  ExternalLink,
  Trash2,
  Calendar,
  Building,
  User,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { TicketStatus, TicketPriority, TicketCategory } from '@/types/ticket';
import { DESIGN_TOKENS, CATEGORY_LABELS } from '@/lib/design-system';
import { TEAM_MEMBERS } from '@/lib/mock-data';

export function TicketModal() {
  const {
    selectedTicket,
    setSelectedTicket,
    updateTicketStatus,
    updateTicket,
    addComment,
    deleteTicket,
  } = useTickets();

  const [newCommentText, setNewCommentText] = useState('');

  if (!selectedTicket) return null;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(selectedTicket.id, newCommentText.trim(), false);
    setNewCommentText('');
  };

  const statusStyle = DESIGN_TOKENS.colors.status[selectedTicket.status];
  const healthStyle = DESIGN_TOKENS.colors.health[selectedTicket.health];

  return (
    <div
      onClick={() => setSelectedTicket(null)}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-end transition-opacity cursor-pointer touch-manipulation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl h-full bg-white dark:bg-[#141824] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200 cursor-auto"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-[#121520]/50">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-semibold text-zinc-400 dark:text-zinc-500">
              {selectedTicket.id}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${healthStyle.bg} ${healthStyle.text} ${healthStyle.border} flex items-center gap-1.5`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${healthStyle.dot}`} />
              {healthStyle.label}
            </span>
            {selectedTicket.isEscalated && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-1">
                ⚠️ Escalated
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/tickets/${selectedTicket.id.replace('#-', '')}`}
              onClick={() => setSelectedTicket(null)}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              title="Open full page view"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this ticket?')) {
                  deleteTicket(selectedTicket.id);
                }
              }}
              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
              title="Delete Ticket"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedTicket(null)}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2 leading-snug">
              {selectedTicket.subject}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
              {selectedTicket.description}
            </p>
          </div>

          {/* Quick Property Changers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-zinc-50/80 dark:bg-[#181D2A] border border-zinc-200/80 dark:border-zinc-800/80">
            {/* Status Selector */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                Status
              </label>
              <select
                value={selectedTicket.isEscalated ? 'escalated' : selectedTicket.status}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'escalated') {
                    updateTicket(selectedTicket.id, { isEscalated: true });
                  } else {
                    updateTicket(selectedTicket.id, { status: val as TicketStatus, isEscalated: false });
                  }
                }}
                className="w-full text-xs font-medium py-1.5 px-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
              >
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="escalated">⚠️ Escalated</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                Priority
              </label>
              <select
                value={selectedTicket.priority}
                onChange={(e) => updateTicket(selectedTicket.id, { priority: e.target.value as TicketPriority })}
                className="w-full text-xs font-medium py-1.5 px-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-hidden capitalize"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="todo">Todo</option>
              </select>
            </div>

            {/* Assignee Selector */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                Assignee
              </label>
              <select
                value={selectedTicket.assignee?.id || 'unassigned'}
                onChange={(e) => {
                  const val = e.target.value;
                  const member = Object.values(TEAM_MEMBERS).find((m) => m.id === val);
                  updateTicket(selectedTicket.id, { assignee: member || undefined });
                }}
                className="w-full text-xs font-medium py-1.5 px-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
              >
                <option value="unassigned">Unassigned</option>
                {Object.values(TEAM_MEMBERS).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Health Selector */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                Health SLA
              </label>
              <select
                value={selectedTicket.health}
                onChange={(e) => updateTicket(selectedTicket.id, { health: e.target.value as any })}
                className="w-full text-xs font-medium py-1.5 px-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
              >
                <option value="on_track">On Track</option>
                <option value="warning">Warning</option>
                <option value="breached">Breached</option>
              </select>
            </div>
          </div>

          {/* Customer Metadata Card */}
          <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#181D2A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-semibold text-xs flex items-center justify-center">
                {selectedTicket.customer.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedTicket.customer.name}
                </h4>
                <p className="text-xs text-zinc-500">
                  {selectedTicket.customer.company} • {selectedTicket.customer.email}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {selectedTicket.customer.tier} Plan
            </span>
          </div>

          {/* Activity Timeline / Discussion */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
              Conversation & Notes ({selectedTicket.comments.length})
            </h3>

            <div className="space-y-3">
              {selectedTicket.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 text-sm"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {comment.authorAvatar ? (
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-[10px] font-semibold flex items-center justify-center">
                          {comment.authorInitials}
                        </div>
                      )}
                      <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                        {comment.authorName}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400">{comment.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 pl-7 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}

              {selectedTicket.comments.length === 0 && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 italic py-2">
                  No comments yet on this ticket.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reply Footer */}
        <form onSubmit={handlePostComment} className="p-4 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-[#121520]/60 flex items-center gap-2">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Write a message or reply..."
            className="flex-1 px-3.5 py-2.5 text-xs bg-white dark:bg-[#181D2A] border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400/50"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-zinc-950 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
