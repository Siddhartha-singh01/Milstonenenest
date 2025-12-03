const File = require('../models/File');
const Task = require('../models/Task');
const { formatSuccess, formatError } = require('../utils/helpers');
const { uploadToS3, deleteFromS3, uploadDir } = require('../config/storage');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');


const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json(formatError('Please upload a file', 400));
        }

        const { taskId, projectId } = req.body;

        let fileUrl = null;
        let storageType = 'local';

        // Upload to S3 if configured
        if (process.env.USE_S3 === 'true') {
            try {
                fileUrl = await uploadToS3(req.file);
                storageType = 's3';
            } catch (error) {
                logger.error(`S3 upload error: ${error.message}`);
                // Fall back to local storage
            }
        }

        // Create file record
        const file = await File.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            url: fileUrl || `/uploads/${req.file.filename}`,
            task: taskId || null,
            project: projectId || null,
            uploadedBy: req.user.id,
            storageType
        });

        // If task specified, add file to task attachments
        if (taskId) {
            await Task.findByIdAndUpdate(
                taskId,
                { $push: { attachments: file._id } }
            );
        }

        const populatedFile = await File.findById(file._id)
            .populate('uploadedBy', 'name email');

        logger.info(`File uploaded: ${file.originalName} by ${req.user.email}`);

        res.status(201).json(formatSuccess(populatedFile, 'File uploaded successfully'));
    } catch (error) {
        logger.error(`Upload file error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Get file by ID
 * @route   GET /api/files/:id
 * @access  Private
 */
const getFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id)
            .populate('uploadedBy', 'name email avatar')
            .populate('task', 'title')
            .populate('project', 'name');

        if (!file) {
            return res.status(404).json(formatError('File not found', 404));
        }

        res.json(formatSuccess(file));
    } catch (error) {
        logger.error(`Get file error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Get files for a task
 * @route   GET /api/files/task/:taskId
 * @access  Private
 */
const getTaskFiles = async (req, res) => {
    try {
        const files = await File.find({ task: req.params.taskId })
            .populate('uploadedBy', 'name email avatar')
            .sort('-createdAt');

        res.json(formatSuccess(files));
    } catch (error) {
        logger.error(`Get task files error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Delete file
 * @route   DELETE /api/files/:id
 * @access  Private
 */
const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json(formatError('File not found', 404));
        }

        // Check if user owns the file
        if (file.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json(formatError('Not authorized to delete this file', 403));
        }

        // Delete from storage
        if (file.storageType === 's3' && file.url) {
            try {
                await deleteFromS3(file.url);
            } catch (error) {
                logger.error(`S3 delete error: ${error.message}`);
            }
        } else if (file.storageType === 'local') {
            try {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            } catch (error) {
                logger.error(`Local file delete error: ${error.message}`);
            }
        }

        // Remove from task attachments
        if (file.task) {
            await Task.findByIdAndUpdate(
                file.task,
                { $pull: { attachments: file._id } }
            );
        }

        await file.deleteOne();

        logger.info(`File deleted: ${file.originalName}`);

        res.json(formatSuccess(null, 'File deleted successfully'));
    } catch (error) {
        logger.error(`Delete file error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

module.exports = {
    uploadFile,
    getFile,
    getTaskFiles,
    deleteFile
};
