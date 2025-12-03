const logger = require('../utils/logger');
const { formatError } = require('../utils/helpers');

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error
    logger.error(`Error: ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = formatError(message, 404);
        return res.status(404).json(error);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field} already exists`;
        error = formatError(message, 400);
        return res.status(400).json(error);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = formatError(message, 400);
        return res.status(400).json(error);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = formatError(message, 401);
        return res.status(401).json(error);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = formatError(message, 401);
        return res.status(401).json(error);
    }

    // Default error
    res.status(error.statusCode || 500).json(
        formatError(error.message || 'Server Error', error.statusCode || 500)
    );
};

/**
 * Not found middleware
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = {
    errorHandler,
    notFound
};
