// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error("Error:", err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = {
      message,
      statusCode: 404,
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
    error = {
      message,
      statusCode: 400,
    };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = {
      message,
      statusCode: 400,
    };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = {
      message,
      statusCode: 401,
    };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = {
      message,
      statusCode: 401,
    };
  }

  // MongoDB connection errors
  if (err.name === "MongoNetworkError" || err.name === "MongoTimeoutError") {
    const message = "Database connection error";
    error = {
      message,
      statusCode: 503,
    };
  }

  // Express validator errors
  if (err.type === "validation") {
    const message = "Validation failed";
    error = {
      message,
      statusCode: 400,
      errors: err.errors,
    };
  }

  // File upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    const message = "File too large";
    error = {
      message,
      statusCode: 400,
    };
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    const message = "Too many files";
    error = {
      message,
      statusCode: 400,
    };
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    const message = "Unexpected file field";
    error = {
      message,
      statusCode: 400,
    };
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = "Too many requests, please try again later";
    error = {
      message,
      statusCode: 429,
    };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || "Server Error";

  // Prepare error response
  const errorResponse = {
    status: "error",
    message,
  };

  // Add error details in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.error = err;
    errorResponse.stack = err.stack;
  }

  // Add validation errors if they exist
  if (error.errors) {
    errorResponse.errors = error.errors;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Handle async errors
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Handle 404 errors
export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error handlers
export const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

export const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

export const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

export const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

export const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

export default errorHandler;