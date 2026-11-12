// ==============================================================================
// WEEK 6: TODO CRUD BACKEND APPLICATION
// ==============================================================================
// Tech Stack: Node.js, Express.js, PostgreSQL (Neon Cloud DB)
// Description: Beginner-friendly Todo CRUD RESTful API backend with PostgreSQL.
// ==============================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Database initialization function
const { initDB } = require('./config/db');

// Todo Routes
const todoRoutes = require('./routes/todo.routes');

// Express App initialize karna
const app = express();
const PORT = process.env.PORT || 5000;

// ==============================================================================
// MIDDLEWARES
// ==============================================================================

// 1. CORS: Cross-Origin Resource Sharing allow karta hai (taaki frontend connect ho sake)
app.use(cors());

// 2. express.json(): Incoming JSON request body (req.body) ko parse karta hai
app.use(express.json());

// 3. express.urlencoded(): Form data parse karne ke liye
app.use(express.urlencoded({ extended: true }));

// 4. Simple Logger Middleware: Har request ko console me print karega
app.use((req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
});

// ==============================================================================
// ROUTES
// ==============================================================================

// 1. Health Check / Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Week-6 Todo Backend API is running successfully!',
    documentation: {
      endpoints: [
        { method: 'POST',   path: '/api/todos',         desc: 'Create a new todo' },
        { method: 'GET',    path: '/api/todos',         desc: 'Get all todos (filter: ?completed=true)' },
        { method: 'GET',    path: '/api/todos/:id',     desc: 'Get a specific todo by ID' },
        { method: 'PUT',    path: '/api/todos/:id',     desc: 'Update a todo (title, description, is_completed)' },
        { method: 'PATCH',  path: '/api/todos/:id/toggle', desc: 'Toggle todo completed status' },
        { method: 'DELETE', path: '/api/todos/:id',     desc: 'Delete a todo by ID' },
      ],
    },
  });
});

// 2. Main Todo API Routes
app.use('/api/todos', todoRoutes);

// 3. 404 Route Handler (Agar user galat URL hit kare)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// 4. Global Error Handler (Unexpected error aane par crash hone se bachata hai)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  });
});

// ==============================================================================
// SERVER STARTUP WITH DATABASE CHECK
// ==============================================================================
const startServer = async () => {
  // Pehle Neon PostgreSQL database connect aur table verify karte hain
  await initDB();

  // Server listen shuru karte hain
  app.listen(PORT, () => {
    console.log('\n======================================================');
    console.log(`🚀 Server listening on: http://localhost:${PORT}`);
    console.log(`📌 API Base URL:       http://localhost:${PORT}/api/todos`);
    console.log('======================================================\n');
  });
};

startServer();

