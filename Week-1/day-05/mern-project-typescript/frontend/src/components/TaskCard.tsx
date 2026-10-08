// TaskCard Component (TypeScript)
// Renders an individual task item with status toggle, priority badge, and edit/delete actions.

import React from "react";
import { Task, Priority } from "../types";

interface TaskCardProps {
  task: Task;
  onToggleStatus: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const isOverdue = Boolean(
    task.dueDate &&
      !task.isCompleted &&
      new Date(task.dueDate).setHours(23, 59, 59, 999) < new Date().getTime()
  );

  const priorityStyles: Record<
    Priority,
    { badge: string; dot: string; label: string }
  > = {
    high: {
      badge:
        "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900/60",
      dot: "bg-rose-500",
      label: "High Priority",
    },
    medium: {
      badge:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900/60",
      dot: "bg-amber-500",
      label: "Medium",
    },
    low: {
      badge:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60",
      dot: "bg-emerald-500",
      label: "Low Priority",
    },
  };

  const currentPriorityStyle = priorityStyles[task.priority] || priorityStyles.medium;

  return (
    <div
      className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        task.isCompleted
          ? "bg-zinc-50/70 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 opacity-80"
          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Toggle Status Checkbox Button */}
        <button
          type="button"
          onClick={() => onToggleStatus(task._id)}
          title={task.isCompleted ? "Mark as pending" : "Mark as completed"}
          className={`mt-1 shrink-0 w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
            task.isCompleted
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-zinc-300 dark:border-zinc-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white dark:bg-zinc-800"
          }`}
        >
          {task.isCompleted && (
            <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Task Details Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-base font-semibold tracking-tight transition ${
                task.isCompleted
                  ? "line-through text-zinc-400 dark:text-zinc-500"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {task.title}
            </h3>

            {/* Action Buttons: Edit & Delete */}
            <div className="flex items-center space-x-1 shrink-0 opacity-90 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onEdit(task)}
                title="Edit task"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => onDelete(task._id)}
                title="Delete task"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Optional Description */}
          {task.description && (
            <p
              className={`mt-1.5 text-sm leading-relaxed whitespace-pre-wrap ${
                task.isCompleted
                  ? "line-through text-zinc-400 dark:text-zinc-600"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Badges / Metadata Footer */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentPriorityStyle.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentPriorityStyle.dot}`} />
              {currentPriorityStyle.label}
            </span>

            {/* Due Date Badge */}
            {formattedDueDate && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  isOverdue
                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formattedDueDate}</span>
                {isOverdue && <span className="font-semibold text-rose-600">(Overdue)</span>}
              </span>
            )}

            {/* Completed Status Tag */}
            {task.isCompleted && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                Done
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
