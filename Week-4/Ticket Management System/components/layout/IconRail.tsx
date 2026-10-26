'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Inbox,
  Ticket,
  User,
  Users,
  BookOpen,
  Bookmark,
  MessageSquare,
  Settings,
  LogOut,
  Command,
} from 'lucide-react';

export function IconRail() {
  const pathname = usePathname();

  const isTicketsActive = pathname === '/' || pathname.startsWith('/tickets');
  const isAnalyticsActive = pathname === '/analytics';
  const isCustomersActive = pathname === '/customers';
  const isSettingsActive = pathname === '/settings';

  return (
    <aside className="hidden md:flex w-16 flex-shrink-0 flex-col items-center py-4 bg-white dark:bg-[#121620] border-r border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      {/* Brand Logo Button */}
      <Link
        href="/tickets"
        className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 flex items-center justify-center shadow-sm transition-transform active:scale-95 mb-6"
        title="Workspace Dashboard"
      >
        <Command className="w-5 h-5 stroke-[2.5]" />
      </Link>

      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center gap-2">
        <Link
          href="/tickets"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
          title="Inbox"
        >
          <Inbox className="w-5 h-5" />
        </Link>

        {/* Tickets (Active Highlight) */}
        <Link
          href="/tickets"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isTicketsActive
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
          }`}
          title="Tickets Board"
        >
          <Ticket className="w-5 h-5" />
        </Link>

        {/* Single Profile / Assignee View */}
        <Link
          href="/analytics"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isAnalyticsActive
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
          }`}
          title="Analytics & SLA Performance"
        >
          <User className="w-5 h-5" />
        </Link>

        {/* Customers / Teams */}
        <Link
          href="/customers"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isCustomersActive
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
          }`}
          title="Customers & Organizations"
        >
          <Users className="w-5 h-5" />
        </Link>

        {/* Knowledge Base */}
        <button
          type="button"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
          title="Knowledge Base & Docs"
        >
          <BookOpen className="w-5 h-5" />
        </button>

        {/* Saved Articles */}
        <button
          type="button"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
          title="Bookmarks & Saved Views"
        >
          <Bookmark className="w-5 h-5" />
        </button>

        {/* Team Chat */}
        <button
          type="button"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
          title="Team Discussions"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </nav>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
        <Link
          href="/settings"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isSettingsActive
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
          }`}
          title="Workspace Settings"
        >
          <Settings className="w-5 h-5" />
        </Link>

        <button
          type="button"
          onClick={() => {
            if (confirm('Are you sure you want to log out?')) {
              alert('You have logged out successfully.');
            }
          }}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
