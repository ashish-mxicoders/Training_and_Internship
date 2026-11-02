const express = require('express');
const app = express();

app.use(express.json());

// Custom error class with HTTP status code
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Simulating async database query using Promise
const fetchUserFromDatabase = (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId === '99') {
        reject(new AppError('User not found', 404));
      } else if (userId === 'fail') {
        reject(new Error('Database query failed'));
      } else {
        resolve({ id: userId, name: 'Ashish Trainee', role: 'Full Stack' });
      }
    }, 300);
  });
};

// Route using async/await with try-catch
app.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await fetchUserFromDatabase(id);
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

// Parallel async operations with Promise.all
app.get('/dashboard', async (req, res, next) => {
  try {
    const fetchUsersCount = () => new Promise(res => setTimeout(() => res(120), 100));
    const fetchOrdersCount = () => new Promise(res => setTimeout(() => res(45), 150));

    const [usersCount, ordersCount] = await Promise.all([
      fetchUsersCount(),
      fetchOrdersCount()
    ]);

    return res.status(200).json({
      success: true,
      data: { usersCount, ordersCount }
    });
  } catch (error) {
    next(error);
  }
});

// Fallback for unhandled routes (404)
app.use((req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// Centralized error handling middleware (4 arguments)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    error: {
      statusCode,
      message
    }
  });
});

module.exports = {
  AppError,
  fetchUserFromDatabase
};
