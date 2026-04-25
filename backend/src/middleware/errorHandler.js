import { config } from '../config/env.js';

/**
 * Global error handler middleware
 * Catches all errors and returns consistent JSON error responses
 * 
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export function errorHandler(err, req, res, next) {
  // Log error details
  console.error('❌ Error occurred:');
  console.error('   Message:', err.message);
  console.error('   Stack:', err.stack);
  console.error('   Request:', {
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Determine status code and error message
  let statusCode = 500;
  let errorMessage = 'Internal server error';
  let errorDetails = undefined;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Validation errors
    statusCode = 400;
    errorMessage = 'Validation error';
    errorDetails = err.message;
  } else if (err.message && err.message.includes('not found')) {
    // Not found errors
    statusCode = 404;
    errorMessage = 'Short URL not found';
  } else if (err.code === 'ECONNREFUSED' || err.message.includes('database') || err.message.includes('connection')) {
    // Database connection errors
    statusCode = 500;
    errorMessage = 'Database connection error';
  } else if (err.statusCode) {
    // Use status code from error if available
    statusCode = err.statusCode;
    errorMessage = err.message || errorMessage;
  } else if (err.message) {
    // Use error message if available
    errorMessage = err.message;
  }

  // Build error response
  const errorResponse = {
    error: errorMessage
  };

  // Include details in development mode
  if (config.nodeEnv === 'development' && errorDetails) {
    errorResponse.details = errorDetails;
  }

  // Include stack trace in development mode
  if (config.nodeEnv === 'development' && err.stack) {
    errorResponse.stack = err.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
}

export default errorHandler;
