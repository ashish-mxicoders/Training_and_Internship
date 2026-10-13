'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  PanelLeft,
  Search,
  Bell,
  MessageSquare,
  Moon,
  Sun,
  ChevronRight,
} from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { CURRENT_USER } from '@/lib/mock-data';

export function Header() {
  const pathname = usePathname();
  const {
    theme,
    toggleTheme,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    searchQuery,
    setSearchQuery,
  } = useTickets();

  // Dynamic breadcrumb text
  let currentPageTitle = 'Tickets';
  if (pathname.startsWith('/tickets/') && pathname !== '/tickets/new') {
    currentPageTitle = 'Ticket Details';
  } else if (pathname === '/tickets/new') {
    currentPageTitle = 'New Ticket';
  } else if (pathname === '/analytics') {
    currentPageTitle = 'Analytics';
  } else if (pathname === '/customers') {
    currentPageTitle = 'Customers';
  } else if (pathname === '/settings') {
    currentPageTitle = 'Settings';
  }

  return (
    <header className="h-16 px-6 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between bg-white dark:bg-[#121620] transition-colors flex-shrink-0">
      {/* Left Breadcrumb & Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100/70 hover:bg-zinc-200 dark:bg-zinc-800/70 dark:hover:bg-zinc-700 transition-colors active:scale-95 cursor-pointer touch-manipulation"
          title={isSidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
          aria-label={isSidebarCollapsed ? 'Open Navigation' : 'Close Navigation'}
        >
          <PanelLeft className="w-4 h-4 stroke-[2.2]" />
        </button>

        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

        <nav className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/tickets"
            className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            Workspace
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {currentPageTitle}
          </span>
        </nav>
      </div>

      {/* Right Utility Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Quick Button */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => {
              const searchInput = document.getElementById('main-search-input');
              if (searchInput) {
                searchInput.focus();
              }
            }}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            title="Search tickets (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#121620]" />
        </button>

        {/* Help / Feedback */}
        <button
          type="button"
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
          title="Customer Feedback"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Dark / Light Mode"
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all active:scale-90"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-zinc-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          )}
        </button>

        {/* User Profile Avatar */}
        <div className="pl-1 sm:pl-2">
          <Link
            href="/settings"
            className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-amber-400 transition-all"
            title={`${CURRENT_USER.name} (${CURRENT_USER.role})`}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-200 ring-1 ring-zinc-300 dark:ring-zinc-700">
              <img
                src={CURRENT_USER.avatar || '/images/avatar-jason.jpg'}
                alt={CURRENT_USER.name}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
