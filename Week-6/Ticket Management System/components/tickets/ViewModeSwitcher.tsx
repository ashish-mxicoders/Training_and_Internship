'use client';

// =====================================================================
// Sub-Component: View Mode Switcher
// Toggles between Kanban Board and Table View modes.
// =====================================================================

import React from 'react';
import { Columns3, Table2 } from 'lucide-react';

interface Props {
  activeViewMode: 'kanban' | 'table';
  setActiveViewMode: (mode: 'kanban' | 'table') => void;
}

export function ViewModeSwitcher({ activeViewMode, setActiveViewMode }: Props) {
  return (
    <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60">
      <button
        type="button"
        onClick={() => setActiveViewMode('kanban')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          activeViewMode === 'kanban'
            ? 'bg-white dark:bg-[#151924] text-zinc-900 dark:text-white shadow-xs'
            : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
        }`}
        title="Kanban Board View"
      >
        <Columns3 className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => setActiveViewMode('table')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          activeViewMode === 'table'
            ? 'bg-white dark:bg-[#151924] text-zinc-900 dark:text-white shadow-xs'
            : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
        }`}
        title="Table List View"
      >
        <Table2 className="w-4 h-4" />
      </button>
    </div>
  );
}

