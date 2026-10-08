// Task CRUD Routes (TypeScript)
// Implements typed Task operations, filtering, pagination, toggling, and deletion.

import { Router, Response } from "express";
import { Types } from "mongoose";
import { Task } from "../models/Task";
import { protect } from "../middleware/authMiddleware";
import {
  IAuthRequest,
  ITaskQueryParams,
  ITaskInputBody,
  TaskPriority,
} from "../types";

const router = Router();

// Apply protect middleware to all task endpoints
router.use(protect);

// Strict MongoDB query filter shape for tasks
interface ITaskDbFilter {
  user: Types.ObjectId;
  isCompleted?: boolean;
  priority?: TaskPriority;
  $or?: Array<{ title?: RegExp; description?: RegExp }>;
}

// ==========================================
// 1. GET ALL TASKS FOR AUTHENTICATED USER
// GET /api/tasks
// ==========================================
router.get(
  "/",
  async (
    req: IAuthRequest<Record<string, string>, unknown, unknown, ITaskQueryParams>,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const { status, priority, search } = req.query;

      // Base query restricted to current user
      const filter: ITaskDbFilter = {
        user: req.user._id,
      };

      // Filter by completed status
      if (status === "completed") {
        filter.isCompleted = true;
      } else if (status === "pending") {
        filter.isCompleted = false;
      }

      // Filter by priority
      if (priority && priority !== "all") {
        filter.priority = priority as TaskPriority;
      }

      // Search by title or description
      if (search && search.trim() !== "") {
        const searchRegex = new RegExp(search.trim(), "i");
        filter.$or = [{ title: searchRegex }, { description: searchRegex }];
      }

      // Query database
      const tasks = await Task.find(filter).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: tasks.length,
        tasks,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch tasks";
      console.error("Get Tasks Error:", message);
      res.status(500).json({
        success: false,
        message,
      });
    }
  }
);

// ==========================================
// 2. CREATE A NEW TASK
// POST /api/tasks
// ==========================================
router.post(
  "/",
  async (
    req: IAuthRequest<Record<string, string>, unknown, ITaskInputBody>,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const { title, description, priority, dueDate } = req.body;

      if (!title || title.trim() === "") {
        res.status(400).json({
          success: false,
          message: "Task title is required",
        });
        return;
      }

      const newTask = await Task.create({
        title: title.trim(),
        description: description ? description.trim() : "",
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        isCompleted: false,
        user: req.user._id,
      });

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        task: newTask,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create task";
      console.error("Create Task Error:", message);
      res.status(500).json({
        success: false,
        message,
      });
    }
  }
);

// ==========================================
// 3. UPDATE AN EXISTING TASK
// PUT /api/tasks/:id
// ==========================================
router.put(
  "/:id",
  async (
    req: IAuthRequest<{ id: string }, unknown, ITaskInputBody>,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const { id } = req.params;
      const { title, description, priority, dueDate, isCompleted } = req.body;

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: "Invalid Task ID format" });
        return;
      }

      const task = await Task.findById(id);

      if (!task) {
        res.status(404).json({
          success: false,
          message: "Task not found",
        });
        return;
      }

      // Check ownership
      if (task.user.toString() !== req.user._id.toString()) {
        res.status(403).json({
          success: false,
          message: "You are not authorized to update this task",
        });
        return;
      }

      // Apply updates
      if (title !== undefined) task.title = title.trim();
      if (description !== undefined) task.description = description.trim();
      if (priority !== undefined) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
      if (isCompleted !== undefined) task.isCompleted = Boolean(isCompleted);

      const updatedTask = await task.save();

      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        task: updatedTask,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update task";
      console.error("Update Task Error:", message);
      res.status(500).json({
        success: false,
        message,
      });
    }
  }
);

// ==========================================
// 4. TOGGLE TASK COMPLETION STATUS
// PATCH /api/tasks/:id/toggle
// ==========================================
router.patch(
  "/:id/toggle",
  async (req: IAuthRequest<{ id: string }>, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: "Invalid Task ID format" });
        return;
      }

      const task = await Task.findById(id);

      if (!task) {
        res.status(404).json({
          success: false,
          message: "Task not found",
        });
        return;
      }

      // Check ownership
      if (task.user.toString() !== req.user._id.toString()) {
        res.status(403).json({
          success: false,
          message: "You are not authorized to modify this task",
        });
        return;
      }

      task.isCompleted = !task.isCompleted;
      const updatedTask = await task.save();

      res.status(200).json({
        success: true,
        message: `Task marked as ${updatedTask.isCompleted ? "completed" : "pending"}`,
        task: updatedTask,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to toggle task status";
      console.error("Toggle Task Error:", message);
      res.status(500).json({
        success: false,
        message,
      });
    }
  }
);

// ==========================================
// 5. DELETE A TASK
// DELETE /api/tasks/:id
// ==========================================
router.delete(
  "/:id",
  async (req: IAuthRequest<{ id: string }>, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: "Invalid Task ID format" });
        return;
      }

      const task = await Task.findById(id);

      if (!task) {
        res.status(404).json({
          success: false,
          message: "Task not found",
        });
        return;
      }

      // Check ownership
      if (task.user.toString() !== req.user._id.toString()) {
        res.status(403).json({
          success: false,
          message: "You are not authorized to delete this task",
        });
        return;
      }

      await Task.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
        deletedTaskId: id,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete task";
      console.error("Delete Task Error:", message);
      res.status(500).json({
        success: false,
        message,
      });
    }
  }
);

export default router;
