'use client';

import React from 'react';
import { Ticket as TicketIcon, Clock, Check, TrendingUp, TrendingDown } from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { TicketStatus } from '@/types/ticket';

export function KpiCardGrid() {
  const { stats, statusFilter, setStatusFilter } = useTickets();

  const cards: Array<{
    title: string;
    icon: React.ReactNode;
    count: number;
    trendText: string;
    trendType: 'positive' | 'negative';
    statusKey?: TicketStatus;
  }> = [
    {
      title: 'TOTAL TICKETS',
      icon: <TicketIcon className="w-3.5 h-3.5" />,
      count: stats.total,
      trendText: '3 (17.6%) vs last week',
      trendType: 'negative', // red ↗ 3 (17.6%) as shown in the screenshot
      statusKey: undefined,
    },
    {
      title: 'OPEN',
      icon: <Clock className="w-3.5 h-3.5" />,
      count: stats.open,
      trendText: '2 (20%) vs last week',
      trendType: 'positive', // green ↘ 2 (20%)
      statusKey: 'open',
    },
    {
      title: 'PENDING',
      icon: <Clock className="w-3.5 h-3.5" />,
      count: stats.pending,
      trendText: '1 (16.7%) vs last week',
      trendType: 'positive', // green ↘ 1 (16.7%)
      statusKey: 'pending',
    },
    {
      title: 'RESOLVED',
      icon: <Check className="w-3.5 h-3.5" />,
      count: stats.resolved,
      trendText: '2 (100%) vs last week',
      trendType: 'positive', // green ↗ 2 (100%)
      statusKey: 'resolved',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const isSelected = card.statusKey && statusFilter === card.statusKey;

        return (
          <div
            key={idx}
            onClick={() => {
              if (card.statusKey) {
                setStatusFilter(statusFilter === card.statusKey ? 'all' : card.statusKey);
              } else {
                setStatusFilter('all');
              }
            }}
            className={`p-5 rounded-2xl bg-white dark:bg-[#151924] border transition-all cursor-pointer select-none group hover:shadow-xs ${
              isSelected
                ? 'border-amber-400 ring-1 ring-amber-400 dark:border-amber-500'
                : 'border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            {/* Header label & icon */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
              <span>{card.icon}</span>
              <span>{card.title}</span>
            </div>

            {/* Metric number */}
            <div className="text-3xl font-semibold text-zinc-900 dark:text-white mt-2.5 tracking-tight">
              {card.count}
            </div>

            {/* Subtext trend badge */}
            <div
              className={`text-xs font-medium flex items-center gap-1 mt-2.5 ${
                card.trendType === 'negative'
                  ? 'text-rose-500 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {card.trendType === 'negative' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>
                {card.trendType === 'negative' ? '↗ ' : '↘ '}
                {card.trendText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
