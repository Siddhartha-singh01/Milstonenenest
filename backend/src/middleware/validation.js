const { validationResult } = require('express-validator');
const { formatError } = require('../utils/helpers');

/**
 * Validate request using express-validator
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => ({
            field: err.param,
            message: err.msg
        }));

        return res.status(400).json({
            success: false,
            errors: errorMessages
        });
    }

    next();
};

module.exports = { validate };
