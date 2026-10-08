import type { Task } from '../types';

/**
 * ============================================================================
 * COMPONENT ARCHITECTURE: TaskItem (Atomic / Presentational Component)
 * ============================================================================
 * 
 * 🏗️ REUSABILITY & PROP CONTRACT:
 * - TaskItem ek self-contained card component hai.
 * - Isko sirf 3 props chahiye:
 *   1. task: Task object
 *   2. onToggle: (id: string) => void
 *   3. onDelete: (id: string) => void
 * - Ye reusable hai aur kisi bhi list ya view me use kiya ja sakta hai.
 */

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="priority-badge priority-high">High</span>;
      case 'medium':
        return <span className="priority-badge priority-medium">Medium</span>;
      case 'low':
        return <span className="priority-badge priority-low">Low</span>;
    }
  };

  return (
    <div className={`task-item-card ${task.isCompleted ? 'is-done' : ''}`}>
      <div className="task-checkbox-col">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.isCompleted}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as ${task.isCompleted ? 'pending' : 'completed'}`}
        />
      </div>

      <div className="task-details-col">
        <div className="task-header-row">
          <h4 className={`task-title ${task.isCompleted ? 'line-through' : ''}`}>
            {task.title}
          </h4>
          {getPriorityBadge(task.priority)}
        </div>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}

        <div className="task-meta">
          <span className="task-date">📅 Created: {task.createdAt}</span>
          <span className="task-status-text">
            {task.isCompleted ? '✅ Completed' : '⏳ Pending'}
          </span>
        </div>
      </div>

      <div className="task-actions-col">
        <button
          type="button"
          className="btn-delete"
          onClick={() => onDelete(task.id)}
          title="Delete Task"
          aria-label="Delete Task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
