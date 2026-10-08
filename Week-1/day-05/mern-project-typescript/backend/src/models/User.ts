// User Model Schema (TypeScript)
// Defines User structure, validation, and exports typed Mongoose Model.

import mongoose, { Schema, Model } from "mongoose";
import { IUserDocument } from "../types";

// User Schema Definition
const userSchema: Schema<IUserDocument> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    timestamps: true,
  }
);

// Export typed Mongoose Model
export const User: Model<IUserDocument> = mongoose.model<IUserDocument>("User", userSchema);
