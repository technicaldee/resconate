/**
 * Error handling utilities and middleware
 */

class ErrorHandler {
  /**
   * Create standardized error response
   */
  createErrorResponse(error, statusCode = 500) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return {
      success: false,
      error: error.message || 'Internal server error',
      ...(isDevelopment && { stack: error.stack }),
      ...(isDevelopment && { details: error })
    };
  }

  /**
   * Handle async route errors
   */
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Global error handler middleware
   */
  errorHandler(err, req, res, next) {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const response = this.createErrorResponse(err, statusCode);

    res.status(statusCode).json(response);
  }

  /**
   * 404 Not Found handler
   */
  notFoundHandler(req, res, next) {
    res.status(404).json({
      success: false,
      error: 'Resource not found',
      path: req.path
    });
  }

  /**
   * Validation error handler
   */
  validationError(message, details = {}) {
    const error = new Error(message);
    error.statusCode = 400;
    error.details = details;
    return error;
  }

  /**
   * Authentication error handler
   */
  authenticationError(message = 'Authentication required') {
    const error = new Error(message);
    error.statusCode = 401;
    return error;
  }

  /**
   * Authorization error handler
   */
  authorizationError(message = 'Insufficient permissions') {
    const error = new Error(message);
    error.statusCode = 403;
    return error;
  }
}

module.exports = new ErrorHandler();

