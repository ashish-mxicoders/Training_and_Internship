// Task CRUD Routes & Handlers
// All routes in this file are protected by the protect middleware.
// Every user can only view, create, edit, or delete their own tasks.

const express = require("express");
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all task routes
router.use(protect);

// ==========================================
// 1. GET ALL TASKS FOR LOGGED IN USER
// GET /api/tasks
// Supports query filters: status, priority, search
// ==========================================
router.get("/", async (req, res) => {
  try {
    const { status, priority, search } = req.query;

    // Base query: only tasks created by the current authenticated user
    const query = { user: req.user._id };

    // Filter by completion status
    if (status === "completed") {
      query.isCompleted = true;
    } else if (status === "pending") {
      query.isCompleted = false;
    }

    // Filter by priority
    if (priority && priority !== "all") {
      query.priority = priority;
    }

    // Search by title or description (case-insensitive regex)
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Fetch matching tasks sorted newest first
    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tasks",
    });
  }
});

// ==========================================
// 2. CREATE A NEW TASK
// POST /api/tasks
// ==========================================
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    // Check mandatory field
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    // Create the task linked to the logged in user
    const newTask = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      priority: priority || "medium",
      dueDate: dueDate || null,
      isCompleted: false,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create task",
    });
  }
});

// ==========================================
// 3. UPDATE AN EXISTING TASK
// PUT /api/tasks/:id
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, isCompleted } = req.body;

    // Find the task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Authorization check: Make sure this task belongs to the logged in user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this task",
      });
    }

    // Update fields if provided in request body
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (isCompleted !== undefined) task.isCompleted = Boolean(isCompleted);

    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update task",
    });
  }
});

// ==========================================
// 4. TOGGLE TASK COMPLETION STATUS
// PATCH /api/tasks/:id/toggle
// ==========================================
router.patch("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Verify ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this task",
      });
    }

    // Flip the status
    task.isCompleted = !task.isCompleted;
    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: `Task marked as ${updatedTask.isCompleted ? "completed" : "pending"}`,
      task: updatedTask,
    });
  } catch (error) {
    console.error("Toggle Task Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle task status",
    });
  }
});

// ==========================================
// 5. DELETE A TASK
// DELETE /api/tasks/:id
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Verify ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this task",
      });
    }

    // Delete task document
    await Task.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      deletedTaskId: id,
    });
  } catch (error) {
    console.error("Delete Task Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete task",
    });
  }
});

module.exports = router;
