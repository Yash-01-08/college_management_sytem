/**
 * Handles requests to routes that don't exist.
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

/**
 * Centralized error handler. Converts known Mongoose/JWT errors into
 * consistent, client-safe JSON responses instead of leaking stack
 * traces or raw driver errors.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose duplicate key error (email, phone, scholarNumber, etc.)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0];
    return res.status(400).json({
      success: false,
      message: field
        ? `${field.charAt(0).toUpperCase() + field.slice(1)} already in use`
        : "Duplicate field value",
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  // Mongoose invalid ObjectId / CastError
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field: ${err.path}`,
    });
  }

  // JWT errors (in case they bubble up outside authMiddleware)
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
  });
};

module.exports = { notFound, errorHandler };
