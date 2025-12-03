const express = require('express');
const router = express.Router();
const {
    uploadFile,
    getFile,
    getTaskFiles,
    deleteFile
} = require('../controllers/fileController');
const { protect } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// Routes
router.post('/upload', protect, uploadSingle('file'), uploadFile);
router.get('/:id', protect, getFile);
router.get('/task/:taskId', protect, getTaskFiles);
router.delete('/:id', protect, deleteFile);

module.exports = router;
