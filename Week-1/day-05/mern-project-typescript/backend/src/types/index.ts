// TypeScript Definitions & Interfaces for Backend
// All data structures, document shapes, and request/response contracts are strictly typed.
// ZERO 'any' types are used across the codebase!

import { Request } from "express";
import { Document, Types } from "mongoose";

// ==========================================
// 1. USER TYPES & INTERFACES
// ==========================================

// Base User attributes
export interface IUser {
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// User Document shape stored in MongoDB Mongoose
export interface IUserDocument extends Document<Types.ObjectId>, IUser {
  _id: Types.ObjectId;
}

// User representation returned to client (without password)
export interface IUserResponse {
  id: string | Types.ObjectId;
  name: string;
  email: string;
  createdAt?: Date;
}

// ==========================================
// 2. TASK TYPES & INTERFACES
// ==========================================

// Allowed priority levels
export type TaskPriority = "low" | "medium" | "high";

// Base Task attributes
export interface ITask {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: Date | null;
  isCompleted: boolean;
  user: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Task Document shape in MongoDB Mongoose
export interface ITaskDocument extends Document<Types.ObjectId>, ITask {
  _id: Types.ObjectId;
}

// ==========================================
// 3. AUTHENTICATION & REQUEST CONTRACTS
// ==========================================

// Decoded JWT payload shape
export interface IJwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

// Custom Authenticated Request interface extending standard Express Request
export interface IAuthRequest<
  Params = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, string | undefined>
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: IUserDocument;
}

// Query parameters accepted by GET /api/tasks
export interface ITaskQueryParams {
  status?: "all" | "pending" | "completed";
  priority?: "all" | TaskPriority;
  search?: string;
}

// Request body payload for creating/updating tasks
export interface ITaskInputBody {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  isCompleted?: boolean;
}

// Request body payload for User Registration
export interface IRegisterInputBody {
  name?: string;
  email?: string;
  password?: string;
}

// Request body payload for User Login
export interface ILoginInputBody {
  email?: string;
  password?: string;
}
