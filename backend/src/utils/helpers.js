// Helper functions for common operations

/**
 * Format error response
 */
const formatError = (message, statusCode = 500) => {
    return {
        success: false,
        error: message,
        statusCode
    };
};

/**
 * Format success response
 */
const formatSuccess = (data, message = 'Success') => {
    return {
        success: true,
        message,
        data
    };
};

/**
 * Paginate results
 */
const paginate = (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return { skip, limit: parseInt(limit) };
};

/**
 * Calculate pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
    return {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
    };
};

/**
 * Generate random color for projects
 */
const generateRandomColor = () => {
    const colors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
        '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Sanitize user object (remove sensitive data)
 */
const sanitizeUser = (user) => {
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    return userObj;
};

/**
 * Calculate task completion percentage
 */
const calculateProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.status === 'done').length;
    return Math.round((completed / tasks.length) * 100);
};

module.exports = {
    formatError,
    formatSuccess,
    paginate,
    getPaginationMeta,
    generateRandomColor,
    sanitizeUser,
    calculateProgress
};
