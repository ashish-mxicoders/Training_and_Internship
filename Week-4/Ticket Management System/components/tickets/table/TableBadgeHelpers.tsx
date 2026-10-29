'use client';

// =====================================================================
// Helper Component: Table Priority & Channel Badges
// =====================================================================

import React from 'react';
import { ArrowUp, ArrowDown, Minus, CircleDashed, Mail, MessageSquare, Globe, Hash } from 'lucide-react';
import { TicketChannel, TicketPriority } from '@/types';

export function TablePriorityBadge({ priority }: { priority: TicketPriority }) {
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
}

export function TableChannelBadge({ channel }: { channel: TicketChannel }) {
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
}

