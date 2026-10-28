'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { IconRail } from './IconRail';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TicketModal } from '../tickets/TicketModal';
import { NewTicketModal } from '../tickets/NewTicketModal';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // If on login or signup page, render standalone clean auth layout without dashboard sidebars or header
  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-zinc-50 dark:bg-[#0c0f17] text-zinc-900 dark:text-zinc-100 antialiased flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#0c0f17] text-zinc-900 dark:text-zinc-100 antialiased overflow-hidden">
      {/* Leftmost Icon Rail */}
      <IconRail />

      {/* Collapsible Sidebar Filter Panel */}
      <Sidebar />

      {/* Center/Right Main App Content Area (Full screen) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-white dark:bg-[#121620]">
        <Header />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

      {/* Global Interactive Drawers / Modals */}
      <TicketModal />
      <NewTicketModal />
    </div>
  );
}
