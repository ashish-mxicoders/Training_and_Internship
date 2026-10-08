import { useReducer, useState, useEffect } from 'react';
import { taskReducer, initialTasksState } from './reducers/taskReducer';
import { Navbar } from './components/Navbar';
import { TaskStats } from './components/TaskStats';
import { ActivityTimer } from './components/ActivityTimer';
import { TaskForm } from './components/TaskForm';
import { TaskFilter } from './components/TaskFilter';
import { TaskList } from './components/TaskList';
import { ConceptGuideModal } from './components/ConceptGuideModal';
import type { Task, FilterStatus, TaskFormData } from './types';
import './App.css';

/**
 * ============================================================================
 * MAIN CONTAINER COMPONENT (App.tsx)
 * ============================================================================
 * 
 * 🏗️ ARCHITECTURE INTEGRATION:
 * App.tsx act karta hai as a Central Container / Orchestrator:
 * - `useReducer` se Tasks ki complex state aur operations manage karta hai.
 * - `useState` se UI state (active filter, modal visibility) manage karta hai.
 * - `useEffect` se side-effects perform karta hai (localStorage auto-save, dynamic document title).
 * - Child presentational components ko props aur dispatch callbacks distribute karta hai.
 */

// Helper to safely load initial state from localStorage
const loadInitialTasks = (): Task[] => {
  try {
    const saved = localStorage.getItem('day06_tasks_list');
    if (saved) {
      return JSON.parse(saved) as Task[];
    }
  } catch (error) {
    console.error('Failed to parse saved tasks from localStorage:', error);
  }
  return initialTasksState;
};

export function App() {
  // ==========================================================================
  // 1. useReducer HOOK
  // ==========================================================================
  // state: tasks array
  // dispatch: function jisse hum actions bhejte hain (ADD_TASK, TOGGLE_TASK, etc.)
  const [tasks, dispatch] = useReducer(taskReducer, [], loadInitialTasks);

  // ==========================================================================
  // 2. useState HOOK (Local UI State)
  // ==========================================================================
  // Active Filter: 'all' | 'pending' | 'completed'
  const [filter, setFilter] = useState<FilterStatus>('all');
  // Guide Modal open/closed state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // ==========================================================================
  // 3. useEffect HOOK #1 (Sync to LocalStorage)
  // ==========================================================================
  // Jab bhi 'tasks' array me koi change hoga (add/toggle/delete), 
  // ye effect automatically browser ke localStorage me save karega.
  useEffect(() => {
    localStorage.setItem('day06_tasks_list', JSON.stringify(tasks));
  }, [tasks]); // Dependency array me [tasks] diya hai

  // ==========================================================================
  // 4. useEffect HOOK #2 (Dynamic Browser Document Title)
  // ==========================================================================
  // Browser ke tab title me pending tasks ka count show karna
  useEffect(() => {
    const pendingCount = tasks.filter((t) => !t.isCompleted).length;
    document.title = pendingCount > 0 
      ? `(${pendingCount}) DevTask Hub | Day-06` 
      : 'All Done! | DevTask Hub';
  }, [tasks]);

  // ==========================================================================
  // DISPATCH HANDLERS (useReducer Action Dispatchers)
  // ==========================================================================
  const handleAddTask = (formData: TaskFormData): void => {
    dispatch({ type: 'ADD_TASK', payload: formData });
  };

  const handleToggleTask = (id: string): void => {
    dispatch({ type: 'TOGGLE_TASK', payload: { id } });
  };

  const handleDeleteTask = (id: string): void => {
    dispatch({ type: 'DELETE_TASK', payload: { id } });
  };

  const handleClearCompleted = (): void => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  };

  // Filtered tasks computation
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.isCompleted;
    if (filter === 'pending') return !task.isCompleted;
    return true; // 'all'
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <div className="app-layout">
      {/* 1. Header with Context API Consumer */}
      <Navbar onOpenGuide={() => setIsGuideOpen(true)} />

      <main className="main-content">
        {/* 2. Side-effect Timer demo */}
        <section className="timer-section">
          <ActivityTimer />
        </section>

        {/* 3. Presentational Stats component */}
        <section className="stats-section">
          <TaskStats tasks={tasks} />
        </section>

        {/* 4. Form (useState demo) + Tasks List (useReducer demo) */}
        <div className="content-grid">
          <div className="grid-left">
            <TaskForm onAddTask={handleAddTask} />
          </div>

          <div className="grid-right">
            <div className="card task-list-card">
              <div className="card-header">
                <h2 className="card-title">📝 Tasks & Objectives</h2>
                <span className="badge badge-success">useReducer State</span>
              </div>

              {/* Filter controls */}
              <TaskFilter
                currentFilter={filter}
                onFilterChange={setFilter}
                onClearCompleted={handleClearCompleted}
                completedCount={completedCount}
              />

              {/* Task list rendering */}
              <TaskList
                tasks={filteredTasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Concept Cheat Sheet Modal */}
      <ConceptGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <footer className="footer">
        <p>
          Week-2 Day-06 Frontend Architecture Project &bull; Built with React, TypeScript, Hooks & Context API
        </p>
      </footer>
    </div>
  );
}

export default App;
