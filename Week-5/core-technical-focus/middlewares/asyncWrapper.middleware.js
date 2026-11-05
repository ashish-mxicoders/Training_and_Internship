// =====================================================================
// Standard Async Error-Handling Wrapper Middleware
// Purpose: Eliminates repetitive try-catch blocks in async controllers.
// It wraps any async controller function and catches any rejected
// Promise or thrown error, forwarding it directly to Express next(err).
// =====================================================================

/**
 * Standard Async Handler Wrapper
 * @param {Function} fn - Asynchronous route handler/controller function (req, res, next)
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    // Automatically catch any error and pass to the global error middleware
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  asyncHandler
};

