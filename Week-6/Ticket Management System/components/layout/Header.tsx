'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Settings,
  LogOut,
  User,
  LogIn,
} from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';

export function Header() {
  const pathname = usePathname();
  const {
    theme,
    toggleTheme,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    searchQuery,
    setSearchQuery,
    showComingSoon,
    currentUser,
    logoutUser,
  } = useTickets();

  // State for profile avatar dropdown
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic breadcrumb text
  let currentPageTitle = 'Tickets';
  if (pathname.startsWith('/tickets/')) {
    currentPageTitle = 'Ticket Details';
  } else if (pathname === '/analytics') {
    currentPageTitle = 'Analytics';
  } else if (pathname === '/customers') {
    currentPageTitle = 'Customers';
  } else if (pathname === '/settings') {
    currentPageTitle = 'Settings';
  } else if (pathname === '/inbox') {
    currentPageTitle = 'Inbox';
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
          onClick={() => showComingSoon('Activity & Alert Notifications')}
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#121620]" />
        </button>

        {/* Help / Feedback */}
        <button
          type="button"
          onClick={() => showComingSoon('Customer Feedback & Support Desk')}
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
          title="Customer Feedback"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Dark / Light Mode"
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all active:scale-90 cursor-pointer"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-zinc-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          )}
        </button>

        {/* Read-Only Role Indicator (Dashboard automatically adapts to DB/Login role) */}
        {currentUser && (
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60 select-none shadow-2xs"
            title={`Active Session Role: ${currentUser.role === 'admin' ? 'Administrator' : 'Customer'}`}
          >
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Role:</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wide ${
                currentUser.role === 'admin'
                  ? 'bg-amber-400 text-zinc-950 shadow-2xs'
                  : 'bg-sky-500 text-white shadow-2xs'
              }`}
            >
              {currentUser.role === 'admin' ? 'Admin' : 'Customer'}
            </span>
          </div>
        )}

        {/* User Profile Avatar with Dropdown (or Sign In button if logged out) */}
        {currentUser ? (
          <div className="relative pl-1 sm:pl-2" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-amber-400 transition-all cursor-pointer"
              title={`${currentUser.name} (${currentUser.role})`}
              aria-expanded={isProfileMenuOpen}
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-200 ring-1 ring-zinc-300 dark:ring-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-700">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{currentUser.initials || 'US'}</span>
                )}
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header Info */}
                <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-700 ring-1 ring-zinc-300 dark:ring-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-200 flex-shrink-0">
                      {currentUser.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{currentUser.initials || 'US'}</span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {currentUser.email}
                      </p>
                      <span
                        className={`inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${
                          currentUser.role === 'admin'
                            ? 'bg-amber-400 text-zinc-950'
                            : 'bg-sky-500 text-white'
                        }`}
                      >
                        {currentUser.role === 'admin' ? 'Admin' : 'Customer'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Actions */}
                <div className="p-1 space-y-0.5">
                  <Link
                    href="/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-xl transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-zinc-400" />
                    <span>Workspace Settings</span>
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      setIsProfileMenuOpen(false);
                      if (confirm('Are you sure you want to log out?')) {
                        await logoutUser();
                        window.location.href = '/login';
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-semibold text-xs transition-colors shadow-xs ml-1"
          >
            <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}
