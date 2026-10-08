// Task Model Schema (TypeScript)
// Defines Task schema, priorities enum, and user relationship.

import mongoose, { Schema, Model } from "mongoose";
import { ITaskDocument } from "../types";

// Task Schema Definition
const taskSchema: Schema<ITaskDocument> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium, or high",
      },
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must belong to a user"],
    },
  },
  {
    timestamps: true,
  }
);

// Export typed Mongoose Model
export const Task: Model<ITaskDocument> = mongoose.model<ITaskDocument>("Task", taskSchema);
