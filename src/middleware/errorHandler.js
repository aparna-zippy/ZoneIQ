/**
 * Global Error Handling Middleware
 * Provides consistent error responses across all API endpoints
 */

class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error (400)
 */
class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Not Found Error (404)
 */
class NotFoundError extends AppError {
  constructor(resource, identifier) {
    super(`${resource} not found${identifier ? `: ${identifier}` : ''}`, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict Error (409) - for unique constraint violations
 */
class ConflictError extends AppError {
  constructor(message, details = null) {
    super(message, 409, details);
    this.name = 'ConflictError';
  }
}

/**
 * Integrity Error (422) - for referential integrity violations
 */
class IntegrityError extends AppError {
  constructor(message, constraints = null) {
    super(message, 422, constraints ? { constraints } : null);
    this.name = 'IntegrityError';
  }
}

/**
 * Database Error Handler
 * Converts PostgreSQL errors to appropriate HTTP errors
 */
function handleDatabaseError(error) {
  // Unique constraint violation
  if (error.code === '23505') {
    const match = error.detail?.match(/Key \((.*?)\)=\((.*?)\)/);
    const field = match ? match[1] : 'field';
    const value = match ? match[2] : 'value';
    return new ConflictError(`${field} already exists`, { [field]: value });
  }

  // Foreign key violation
  if (error.code === '23503') {
    const match = error.detail?.match(/Key \((.*?)\)=\((.*?)\) is not present/);
    const field = match ? match[1] : 'reference';
    return new ValidationError(`Invalid ${field}`, { [field]: 'does not exist' });
  }

  // Not null violation
  if (error.code === '23502') {
    const field = error.column || 'field';
    return new ValidationError(`${field} is required`, { [field]: 'cannot be null' });
  }

  // Check constraint violation
  if (error.code === '23514') {
    return new ValidationError('Constraint violation', { constraint: error.constraint });
  }

  // Default database error
  return new AppError('Database error', 500, process.env.NODE_ENV === 'development' ? { original: error.message } : null);
}

/**
 * Global Error Handler Middleware
 */
function errorHandler(err, req, res, next) {
  let error = err;

  // Convert database errors
  if (err.code && err.code.startsWith('23')) {
    error = handleDatabaseError(err);
  }

  // Handle Joi validation errors
  if (err.isJoi || err.name === 'ValidationError' && err.details) {
    const details = {};
    if (err.details && Array.isArray(err.details)) {
      err.details.forEach(detail => {
        const key = detail.path.join('.');
        if (!details[key]) details[key] = [];
        details[key].push(detail.message.replace(/"/g, ''));
      });
    }
    error = new ValidationError('Validation failed', details);
  }

  // Default to 500 if no status code
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log error
  if (statusCode >= 500) {
    console.error('ERROR:', {
      message: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Send response
  const response = {
    error: error.name || 'Error',
    message: message,
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500 && { stack: error.stack }),
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
}

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  asyncHandler,
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  IntegrityError,
};
