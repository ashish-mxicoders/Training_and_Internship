import type { FilterStatus } from '../types';

/**
 * ============================================================================
 * COMPONENT ARCHITECTURE: TaskFilter
 * ============================================================================
 * 
 * 🏗️ Controlled Filter Bar:
 * - Parent component se current active filter receive karta hai.
 * - Button click par parent ka callback function invoke karta hai.
 */

interface TaskFilterProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
  completedCount: number;
}

export const TaskFilter = ({
  currentFilter,
  onFilterChange,
  onClearCompleted,
  completedCount,
}: TaskFilterProps) => {
  return (
    <div className="filter-bar">
      <div className="filter-buttons">
        <button
          type="button"
          className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        <button
          type="button"
          className={`filter-btn ${currentFilter === 'pending' ? 'active' : ''}`}
          onClick={() => onFilterChange('pending')}
        >
          Pending
        </button>
        <button
          type="button"
          className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          Completed
        </button>
      </div>

      {completedCount > 0 && (
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={onClearCompleted}
          title="Clear all completed tasks"
        >
          🧹 Clear Completed ({completedCount})
        </button>
      )}
    </div>
  );
};
