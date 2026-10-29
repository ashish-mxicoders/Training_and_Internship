'use client';

// =====================================================================
// Isolated Client Component: Settings View
// User profile, theme mode toggle, team directory, and database management.
// =====================================================================

import React from 'react';
import {
  Moon,
  Sun,
  RefreshCw,
  User,
  LogOut,
  Mail,
  Building,
} from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { TEAM_MEMBERS } from '@/lib/mock-data';

export function SettingsView() {
  const {
    theme,
    toggleTheme,
    tickets,
    currentUser,
    logoutUser,
  } = useTickets();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Top Header with Title and Top-Right Logout Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Workspace Settings
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage your personal profile, theme mode, team directory, and database data
          </p>
        </div>

        {/* Top-Right Logout Button */}
        <div>
          <button
            type="button"
            onClick={async () => {
              if (confirm('Are you sure you want to log out of your account?')) {
                await logoutUser();
                window.location.href = '/login';
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 transition-all active:scale-95 cursor-pointer shadow-2xs"
            title="Log Out of Workspace"
          >
            <LogOut className="w-4 h-4 stroke-[2.2]" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* SECTION: Current User Profile Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-amber-500" />
              <span>Active Account Profile</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Personal credentials and authorization role for the currently logged-in user
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              currentUser?.role === 'admin'
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60'
                : 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-900/60'
            }`}
          >
            {currentUser?.role === 'admin' ? 'Administrator' : 'Customer Account'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-1">
          {/* User Avatar */}
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-700 ring-2 ring-amber-400/50 flex-shrink-0 flex items-center justify-center text-lg font-bold text-zinc-700 dark:text-zinc-200 shadow-sm">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{currentUser?.initials || 'US'}</span>
            )}
          </div>

          {/* User Info Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            <div className="p-3 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider mb-1 flex items-center gap-1.5">
                <User className="w-3 h-3 text-zinc-400" />
                <span>Full Name</span>
              </span>
              <span className="text-sm font-bold text-zinc-900 dark:text-white truncate block">
                {currentUser?.name || 'User'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider mb-1 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-zinc-400" />
                <span>Email Address</span>
              </span>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate block">
                {currentUser?.email || 'user@example.com'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider mb-1 flex items-center gap-1.5">
                <Building className="w-3 h-3 text-zinc-400" />
                <span>Company / Org</span>
              </span>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate block">
                {currentUser?.company || 'Helpdesk Client'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Appearance & UI Presentation */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
            Interface Appearance & Display Canvas
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Choose theme modes and aesthetic wallpaper presentation
          </p>
        </div>

        <div className="max-w-md">
          <div
            onClick={toggleTheme}
            className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-amber-400 cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white">
                  Color Mode: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Click to switch to {theme === 'dark' ? 'Light' : 'Dark'} theme
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-white dark:bg-zinc-800 border rounded-lg">
              Toggle
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: Team Members Directory */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
            Support Team & Triage Roster
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Engineers and specialists assigned to incoming customer queues
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.values(TEAM_MEMBERS).map((member) => (
            <div
              key={member.id}
              className="p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-800/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 font-semibold text-xs flex items-center justify-center">
                    {member.initials}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                    {member.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400">{member.role}</p>
                </div>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                {tickets.filter((t) => t.assignee?.id === member.id).length} tickets
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Neon PostgreSQL Database & Seed Restoration */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <span>Neon PostgreSQL Database</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-900/60">
              Connected
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
            All tickets, comments, categories, and user accounts are stored in your Neon PostgreSQL database. You can restore the original mock dataset anytime.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={async () => {
              if (confirm('Restore PostgreSQL database with default 20 tickets, categories, and accounts (all passwords = 123456)?')) {
                try {
                  const res = await fetch('/api/seed', { method: 'POST' });
                  if (res.ok) {
                    alert('PostgreSQL Database restored and seeded successfully!');
                    window.location.reload();
                  } else {
                    alert('Failed to restore database seed data.');
                  }
                } catch (e) {
                  alert('Network error while resetting database.');
                }
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 text-xs font-semibold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 stroke-[2.5]" />
            <span>Restore PostgreSQL Seed Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}

