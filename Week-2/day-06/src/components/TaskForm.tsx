import { useState } from 'react';
import type { FormEvent } from 'react';
import type { TaskFormData, TaskPriority } from '../types';

/**
 * ============================================================================
 * HOOK DEMO: useState in Action (Controlled Form Component)
 * ============================================================================
 * 
 * ❓ useState KYA HAI?
 * - useState React ka sabse fundamental hook hai jo kisi component ke andar
 *   Local State (data jo user interaction ke sath badalta hai) store karta hai.
 * - Syntax: `const [value, setValue] = useState(initialValue);`
 * 
 * 📝 CONTROLLED INPUTS PATTERN:
 * HTML form inputs ko React state ke sath bind karne ke do parts hote hain:
 * 1. `value={title}` -> Input hamesha React state se value read karta hai.
 * 2. `onChange={(e) => setTitle(e.target.value)}` -> User typing par state update karta hai.
 */

interface TaskFormProps {
  onAddTask: (taskData: TaskFormData) => void;
}

export const TaskForm = ({ onAddTask }: TaskFormProps) => {
  // 1. Local state for form inputs using useState
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 2. Form submission handler
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Validation check
    if (!title.trim()) {
      setErrorMessage('Task title is required!');
      return;
    }

    // Call parent handler (which will dispatch to useReducer)
    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
    });

    // 3. Reset local form state back to initial values
    setTitle('');
    setDescription('');
    setPriority('medium');
    setErrorMessage('');
  };

  return (
    <div className="card task-form-card">
      <div className="card-header">
        <h2 className="card-title">➕ Create New Task</h2>
        <span className="badge badge-info">useState Demo</span>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        {errorMessage && (
          <div className="alert-error" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="task-title" className="form-label">
            Task Title <span className="text-danger">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className="form-input"
            placeholder="e.g. Implement useReducer architecture..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-desc" className="form-label">
            Description (Optional)
          </label>
          <textarea
            id="task-desc"
            className="form-textarea"
            rows={2}
            placeholder="Key concepts or action items..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="task-priority" className="form-label">
              Priority Level
            </label>
            <select
              id="task-priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
          </div>

          <div className="form-actions-inline">
            <button type="submit" className="btn btn-primary submit-btn">
              Add Task
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
