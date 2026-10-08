// Main Application Component
// Task Management System (Frontend)
// React + Tailwind CSS + Context API + REST API Client

import React, { useState, useEffect, useCallback } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AuthCard from "./components/AuthCard";
import TaskStats from "./components/TaskStats";
import TaskFilters from "./components/TaskFilters";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import EmptyState from "./components/EmptyState";
import {
  fetchTasks,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
} from "./services/api";

// Main Dashboard view (active when user is logged in)
function Dashboard() {
  const { token, user } = useAuth();

  // Task list and loading states
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Modal dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Helper to flash temporary toast/banner messages
  const showFeedback = (type, message) => {
    setFeedbackMessage({ type, message });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  // Fetch tasks from backend API
  const loadTasks = useCallback(async () => {
    if (!token) return;
    setIsLoadingTasks(true);
    try {
      const res = await fetchTasks(token, {
        status: statusFilter,
        priority: priorityFilter,
        search: search,
      });
      if (res.success) {
        setTasks(res.tasks || []);
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
      showFeedback("error", err.message || "Failed to load tasks");
    } finally {
      setIsLoadingTasks(false);
    }
  }, [token, statusFilter, priorityFilter, search]);

  // Reload tasks whenever filters change
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Open modal to add a brand new task
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Open modal to edit an existing task
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Create or Update task handler
  const handleSaveTask = async (taskFormData) => {
    if (editingTask) {
      // Update existing task
      const res = await updateTask(token, editingTask._id, taskFormData);
      if (res.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? res.task : t))
        );
        showFeedback("success", "Task updated successfully!");
      }
    } else {
      // Create new task
      const res = await createTask(token, taskFormData);
      if (res.success) {
        // Prepend new task to list
        setTasks((prev) => [res.task, ...prev]);
        showFeedback("success", "New task added successfully!");
      }
    }
  };

  // Toggle task completed status
  const handleToggleStatus = async (taskId) => {
    try {
      const res = await toggleTaskStatus(token, taskId);
      if (res.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? res.task : t))
        );
        showFeedback(
          "success",
          res.task.isCompleted
            ? "Task marked as completed! Great job!"
            : "Task marked as pending"
        );
      }
    } catch (err) {
      showFeedback("error", err.message || "Failed to toggle status");
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteTask(token, taskId);
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
        showFeedback("success", "Task deleted successfully");
      }
    } catch (err) {
      showFeedback("error", err.message || "Failed to delete task");
    }
  };

  // Clear active filters
  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  const isFiltered = search !== "" || statusFilter !== "all" || priorityFilter !== "all";

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Feedback Notification Banner */}
      {feedbackMessage && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center justify-between text-sm shadow-md transition-all animate-in fade-in slide-in-from-top duration-200 ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
              : "bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>
              {feedbackMessage.type === "success" ? "✓" : "⚠"}
            </span>
            <span className="font-medium">{feedbackMessage.message}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Greeting Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Hello, {user?.name || "Developer"} 👋
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Here is your daily task dashboard. Stay focused and finish strong!
          </p>
        </div>
      </div>

      {/* Key Stats Bar */}
      <TaskStats tasks={tasks} />

      {/* Search & Filters */}
      <TaskFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Task List Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 tracking-tight">
            Your Tasks ({tasks.length})
          </h2>
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
            >
              Reset active filters
            </button>
          )}
        </div>

        {/* Loading state indicator */}
        {isLoadingTasks ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          /* Empty state */
          <EmptyState
            isFiltered={isFiltered}
            onResetFilters={handleResetFilters}
            onOpenCreateModal={handleOpenCreateModal}
          />
        ) : (
          /* Task Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </main>
  );
}

// Inner App Controller to handle auth check
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Initial token verification loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            Initializing TaskFlow...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <div className="flex-1">
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <div className="py-12 px-4 flex flex-col items-center justify-center">
            <AuthCard />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>
          MERN Task Management App &bull; Built with Express, MongoDB, React & Tailwind CSS
        </p>
        <p className="mt-1 text-zinc-400 dark:text-zinc-500">
          Ready for TypeScript Refactoring Practice (Week-1 Day-5)
        </p>
      </footer>
    </div>
  );
}

// Main App Root with Providers
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
