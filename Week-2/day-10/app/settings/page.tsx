'use client';

import React from 'react';
import {
  Moon,
  Sun,
  RefreshCw,
  Users,
  Shield,
  Bell,
  Check,
} from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { TEAM_MEMBERS, CURRENT_USER } from '@/lib/mock-data';

export default function SettingsPage() {
  const {
    theme,
    toggleTheme,
    resetToDefaults,
    tickets,
  } = useTickets();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Workspace Settings
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Configure appearance, view framing, team members, and telemetry preferences
        </p>
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
          {/* Light / Dark Mode Toggle Card */}
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

      {/* SECTION: Session Storage & Reset */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
            Session Storage & Demo State
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Currently tracking {tickets.length} tickets locally in browser session storage. You can restore the exact initial 20 tickets from the design anytime.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset tickets back to default 20 tickets from the design?')) {
                resetToDefaults();
                alert('Tickets reset successfully to initial dataset.');
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial 20 Tickets</span>
          </button>
        </div>
      </div>
    </div>
  );
}
