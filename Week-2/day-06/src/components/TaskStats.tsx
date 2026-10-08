import type { Task } from '../types';

/**
 * ============================================================================
 * COMPONENT ARCHITECTURE: Presentational Component (TaskStats)
 * ============================================================================
 * 
 * 🏗️ PRESENTATIONAL COMPONENT CONCEPT:
 * - Ye component koi local state ya API calls nahi karta.
 * - Iska ek hi kaam hai: Parent se 'tasks' array lena via Props, aur
 *   statistics calculate karke beautiful UI render karna.
 * - Pure UI hone ki wajah se ye easily testable aur reusable hota hai.
 */

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats = ({ tasks }: TaskStatsProps) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.isCompleted).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-icon">📋</span>
        <div className="stat-info">
          <p className="stat-label">Total Tasks</p>
          <h3 className="stat-value">{total}</h3>
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-icon">⏳</span>
        <div className="stat-info">
          <p className="stat-label">Pending</p>
          <h3 className="stat-value text-warning">{pending}</h3>
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-icon">✅</span>
        <div className="stat-info">
          <p className="stat-label">Completed</p>
          <h3 className="stat-value text-success">{completed}</h3>
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-icon">📊</span>
        <div className="stat-info">
          <p className="stat-label">Completion Rate</p>
          <h3 className="stat-value text-primary">{percentage}%</h3>
        </div>
      </div>
    </div>
  );
};
