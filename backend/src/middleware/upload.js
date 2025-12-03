const { upload } = require('../config/storage');
const { formatError } = require('../utils/helpers');

/**
 * Single file upload middleware
 */
const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        const uploadMiddleware = upload.single(fieldName);

        uploadMiddleware(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json(
                        formatError('File size too large. Maximum size is 10MB', 400)
                    );
                }
                return res.status(400).json(formatError(err.message, 400));
            }
            next();
        });
    };
};

/**
 * Multiple files upload middleware
 */
const uploadMultiple = (fieldName, maxCount = 5) => {
    return (req, res, next) => {
        const uploadMiddleware = upload.array(fieldName, maxCount);

        uploadMiddleware(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json(
                        formatError('File size too large. Maximum size is 10MB', 400)
                    );
                }
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json(
                        formatError(`Too many files. Maximum is ${maxCount}`, 400)
                    );
                }
                return res.status(400).json(formatError(err.message, 400));
            }
            next();
        });
    };
};

module.exports = {
    uploadSingle,
    uploadMultiple
};
