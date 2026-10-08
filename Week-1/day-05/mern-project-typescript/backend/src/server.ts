// Server Entry Point (TypeScript)
// Configures Express, connects to MongoDB, and registers strictly typed routes.

import dotenv from "dotenv";
// Load environment variables immediately
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

// Create Express Application
const app: Application = express();

// Connect to MongoDB Atlas
connectDB();

// ------------------------------------------
// Core Middlewares
// ------------------------------------------
app.use(cors());
app.use(express.json());

// ------------------------------------------
// Health Check Root Endpoint
// ------------------------------------------
app.get("/", (_req: Request, res: Response): void => {
  res.status(200).json({
    status: "online",
    stack: "TypeScript MERN Task Manager",
    message: "TypeScript API is running with strict typing & zero 'any'!",
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------------------
// API Routes
// ------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ------------------------------------------
// 404 Route Not Found Handler
// ------------------------------------------
app.use((req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ------------------------------------------
// Start Server
// ------------------------------------------
const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, (): void => {
  console.log(`===============================================`);
  console.log(` TypeScript Server is running on: http://localhost:${PORT}`);
  console.log(` Strict TypeScript Mode: ENABLED (Zero 'any')`);
  console.log(`===============================================`);
});
