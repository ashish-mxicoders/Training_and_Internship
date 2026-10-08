// EmptyState Component
// Shown when no tasks match current filters or when a user has zero tasks.

import React from "react";

export default function EmptyState({ isFiltered, onResetFilters, onOpenCreateModal }) {
  return (
    <div className="py-14 px-4 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
        {isFiltered ? "No matching tasks found" : "No tasks added yet"}
      </h3>
      <p className="max-w-sm mx-auto mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {isFiltered
          ? "Try adjusting your search keywords, status filter, or priority dropdown."
          : "Stay productive and organize your daily work by creating your very first task!"}
      </p>

      <div className="mt-5 flex items-center justify-center gap-3">
        {isFiltered ? (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition cursor-pointer"
          >
            Clear Filters
          </button>
        ) : (
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            + Create First Task
          </button>
        )}
      </div>
    </div>
  );
}
