'use client';

// =====================================================================
// Sub-Component: Ticket Detail Conversation Thread
// Issue description, comments timeline, and reply response form.
// =====================================================================

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Ticket } from '@/types';

interface Props {
  ticket: Ticket;
  onPostComment: (content: string) => void;
}

export function TicketDetailConversation({ ticket, onPostComment }: Props) {
  const [commentInput, setCommentInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onPostComment(commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="space-y-6">
      {/* Main Description Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Issue Description
        </h3>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {ticket.description}
        </p>
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
        onSubmit={handleSubmit}
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
  );
}

