'use client';

import React, { useState } from 'react';
import { Download, Plus, ChevronUp, ChevronDown, Upload, FileCode } from 'lucide-react';
import { useTickets } from '@/lib/ticket-context';
import { KpiCardGrid } from '@/components/tickets/KpiCardGrid';
import { FilterToolbar } from '@/components/tickets/FilterToolbar';
import { KanbanBoard } from '@/components/tickets/KanbanBoard';
import { TableView } from '@/components/tickets/TableView';

export default function TicketsPage() {
  const { filteredTickets, activeViewMode, setIsNewTicketModalOpen } = useTickets();
  const [isExporting, setIsExporting] = useState(false);
  const [isNewTicketMenuOpen, setIsNewTicketMenuOpen] = useState(false);

  // CSV Export
  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const headers = ['ID', 'Subject', 'Status', 'Priority', 'Assignee', 'Category', 'Channel', 'Health', 'Company'];
      const rows = filteredTickets.map((t) => [
        t.id,
        `"${t.subject.replace(/"/g, '""')}"`,
        t.status,
        t.priority,
        `"${t.assignee?.name || 'Unassigned'}"`,
        t.category,
        t.channel,
        t.health,
        `"${t.customer?.company || ''}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `tickets_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setTimeout(() => setIsExporting(false), 600);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Tickets
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-white dark:bg-[#151924] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>{isExporting ? 'Exporting...' : 'Export'}</span>
          </button>

          {/* New Ticket Primary Button with Caret Dropdown */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => setIsNewTicketModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-500 text-zinc-950 rounded-l-xl transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Ticket</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNewTicketMenuOpen(!isNewTicketMenuOpen)}
              className="px-2 py-2 bg-amber-400 hover:bg-amber-500 text-zinc-950 rounded-r-xl border-l border-amber-500/40 transition-colors"
              title="More creation options"
            >
              {isNewTicketMenuOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Caret dropdown popover */}
            {isNewTicketMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-[#181D29] border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-30 py-1 animate-in fade-in-50">
                <button
                  onClick={() => {
                    setIsNewTicketModalOpen(true);
                    setIsNewTicketMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-500" />
                  <span>Standard Ticket</span>
                </button>
                <button
                  onClick={() => {
                    alert('Bulk CSV Import dialog ready: Select CSV file to batch load tickets.');
                    setIsNewTicketMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Bulk Import CSV</span>
                </button>
                <button
                  onClick={() => {
                    setIsNewTicketMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <FileCode className="w-3.5 h-3.5 text-zinc-400" />
                  <span>From Template</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <KpiCardGrid />

      {/* Filter and Search Bar */}
      <FilterToolbar />

      {/* Active View (Kanban Board vs Table View) */}
      {activeViewMode === 'kanban' ? <KanbanBoard /> : <TableView />}
    </div>
  );
}
