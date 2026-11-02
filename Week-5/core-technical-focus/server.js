const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { requestLogger } = require('./middlewares/logger.middleware');
const { errorHandler, createError } = require('./middlewares/error.middleware');
const apiRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// Built-in & third-party middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Serve browser client for localStorage / sessionStorage sync
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/api', apiRoutes);

// Fallback for undefined routes
app.use((req, res, next) => {
  next(createError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// Centralized error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
