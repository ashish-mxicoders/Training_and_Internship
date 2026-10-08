// Task Model Schema
const mongoose = require("mongoose");

// Define Task schema structure
const taskSchema = new mongoose.Schema(
  {
    // Short title for the task
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    // Detailed description of the task
    description: {
      type: String,
      trim: true,
      default: "",
    },
    // Priority level of the task
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium, or high",
      },
      default: "medium",
    },
    // Optional deadline/due date
    dueDate: {
      type: Date,
      default: null,
    },
    // Completion status flag
    isCompleted: {
      type: Boolean,
      default: false,
    },
    // Reference to the user who created this task
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must belong to a user"],
    },
  },
  {
    // Automatically manage createdAt and updatedAt fields
    timestamps: true,
  }
);

// Export Task model
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
