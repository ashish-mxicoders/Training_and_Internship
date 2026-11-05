// =====================================================================
// Standard API Response and Error Formatting Wrappers
// Purpose: Standardizes response JSON format across all API endpoints.
// =====================================================================

/**
 * Standard API Success Response Formatter
 * Returns uniform JSON structure:
 * {
 *   success: true,
 *   statusCode: 200,
 *   message: "Operation successful",
 *   data: { ... }
 * }
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data
  });
};

/**
 * Standard Custom API Error Factory
 * Attaches HTTP status code and optional details to native Error object
 */
const createApiError = (message, statusCode = 500, details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (details) {
    error.details = details;
  }
  return error;
};

module.exports = {
  sendSuccess,
  createApiError
};

