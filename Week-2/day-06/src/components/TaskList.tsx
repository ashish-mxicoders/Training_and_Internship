import { TaskItem } from './TaskItem';
import type { Task } from '../types';

/**
 * ============================================================================
 * COMPONENT ARCHITECTURE: TaskList (List Rendering & Empty State)
 * ============================================================================
 * 
 * 🏗️ LIST RENDERING BEST PRACTICES:
 * - Hamesha unique `key` prop provide karein (e.g. `key={task.id}`).
 *   Index ko key ke roop me use na karein kyunki reordering/deletion me bugs aate hain.
 * - Empty state condition handle karein jab array me koi item na ho.
 */

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList = ({ tasks, onToggleTask, onDeleteTask }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📂</div>
        <h3 className="empty-title">No tasks found in this view</h3>
        <p className="empty-desc">Create a new task above or switch your filter!</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
};
