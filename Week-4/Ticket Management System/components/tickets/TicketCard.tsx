'use client';

import React from 'react';
import {
  Mail,
  MessageSquare,
  Globe,
  Hash,
  ArrowUp,
  ArrowDown,
  Minus,
  CircleDashed,
} from 'lucide-react';
import { Ticket, TicketChannel, TicketPriority, TicketHealth } from '@/types/ticket';
import { DESIGN_TOKENS } from '@/lib/design-system';

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function TicketCard({ ticket, onClick, onDragStart }: TicketCardProps) {
  // Channel icon
  const renderChannelIcon = (channel: TicketChannel) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />;
      case 'chat':
        return <MessageSquare className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />;
      case 'web':
        return <Globe className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />;
      case 'slack':
        return <Hash className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />;
      default:
        return <Mail className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />;
    }
  };

  // Priority icon
  const renderPriorityIcon = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent':
        return <ArrowUp className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" />;
      case 'high':
        return <ArrowUp className="w-3.5 h-3.5 text-amber-500 stroke-[2.5]" />;
      case 'medium':
        return <Minus className="w-3.5 h-3.5 text-sky-500 stroke-[3]" />;
      case 'low':
        return <ArrowDown className="w-3.5 h-3.5 text-zinc-400 stroke-[2.5]" />;
      case 'todo':
        return <CircleDashed className="w-3.5 h-3.5 text-zinc-400 stroke-[2]" />;
      default:
        return <Minus className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  // Health Pill
  const healthConfig = DESIGN_TOKENS.colors.health[ticket.health] || DESIGN_TOKENS.colors.health.on_track;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="p-4 rounded-xl bg-white dark:bg-[#181D29] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all cursor-pointer group select-none active:scale-[0.99]"
    >
      {/* Top Row: Channel + Priority + Ticket ID */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          {renderChannelIcon(ticket.channel)}
          {renderPriorityIcon(ticket.priority)}
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-medium">
          #{ticket.id}
        </span>
      </div>

      {/* Middle: Subject */}
      <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug mb-4">
        {ticket.subject}
      </h4>

      {/* Bottom: Assignee Avatar + Health Tag & Escalated Mark */}
      <div className="flex items-start justify-between pt-1 gap-2">
        {/* Assignee */}
        <div className="flex items-center mt-0.5">
          {ticket.assignee ? (
            ticket.assignee.avatar ? (
              <img
                src={ticket.assignee.avatar}
                alt={ticket.assignee.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                title={ticket.assignee.name}
              />
            ) : (
              <div
                className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-semibold flex items-center justify-center ring-1 ring-zinc-200/60 dark:ring-zinc-700/60"
                title={ticket.assignee.name}
              >
                {ticket.assignee.initials}
              </div>
            )
          ) : (
            <div
              className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-[10px] font-semibold flex items-center justify-center ring-1 ring-dashed ring-zinc-300 dark:ring-zinc-700"
              title="Unassigned"
            >
              --
            </div>
          )}
        </div>

        {/* Right side: Health Tag Pill on top, Escalated directly below it */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${healthConfig.bg} ${healthConfig.text} ${healthConfig.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${healthConfig.dot}`} />
            <span>{healthConfig.label}</span>
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
      </div>
    </div>
  );
}
