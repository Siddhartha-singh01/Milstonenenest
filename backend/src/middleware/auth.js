const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { formatError } = require('../utils/helpers');

/**
 * Protect routes - verify JWT token
 */
const protect = async (req, res, next) => {
    let token;     

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json(formatError('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json(formatError('User not found', 401));
        }

        if (!req.user.isActive) {
            return res.status(401).json(formatError('User account is inactive', 401));
        }

        next();
    } catch (error) {
        return res.status(401).json(formatError('Not authorized to access this route', 401));
    }
};

/**
 * Grant access to specific roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json(
                formatError(`User role ${req.user.role} is not authorized to access this route`, 403)
            );
        }
        next();
    };
};

/**
 * Generate JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = {
    protect,
    authorize,
    generateToken
};
