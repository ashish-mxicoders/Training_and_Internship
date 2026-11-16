// =====================================================================
// Next.js Server Component: /tickets
// The page shell renders on the server with full metadata.
// Interactive islands (button, filters, view toggle) are isolated client components.
// =====================================================================

import React from 'react';
import { Metadata } from 'next';
import { KpiCardGrid } from '@/components/tickets/KpiCardGrid';
import { FilterToolbar } from '@/components/tickets/FilterToolbar';
import { NewTicketButton } from '@/components/tickets/NewTicketButton';
import { TicketsActiveView } from '@/components/tickets/TicketsActiveView';

export const metadata: Metadata = {
  title: 'Tickets Dashboard | Ticket Management System',
  description: 'Manage, triage, and track support tickets with SLA deadlines',
};

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Tickets
          </h1>
        </div>

        {/* Action Button Island */}
        <div className="flex items-center gap-2.5">
          <NewTicketButton />
        </div>
      </div>

      {/* KPI Cards Row */}
      <KpiCardGrid />

      {/* Filter and Search Bar Island */}
      <FilterToolbar />

      {/* Dynamic View Island (Kanban Board vs Table View) */}
      <TicketsActiveView />
    </div>
  );
}
