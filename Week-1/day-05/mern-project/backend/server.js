// Main Server Entry Point
// Task Management Application (Backend)
// Express + MongoDB + JWT Authentication

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Initialize Express application
const app = express();

// Connect to MongoDB Atlas
connectDB();

// ------------------------------------------
// Core Middlewares
// ------------------------------------------
// Allow requests from frontend (cross-origin)
app.use(cors());

// Parse incoming JSON payloads in request body
app.use(express.json());

// ------------------------------------------
// API Routes
// ------------------------------------------
// Root health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Task Management MERN API is running smoothly!",
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes (Register, Login, Me)
app.use("/api/auth", authRoutes);

// Task management CRUD routes
app.use("/api/tasks", taskRoutes);

// ------------------------------------------
// 404 Not Found Handler
// ------------------------------------------
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ------------------------------------------
// Global Error Handler Middleware
// ------------------------------------------
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ------------------------------------------
// Start Server
// ------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Server is running on: http://localhost:${PORT}`);
  console.log(` Ready for Task Management requests!`);
  console.log(`===============================================`);
});