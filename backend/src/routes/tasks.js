const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    updateTaskStatus,
    moveTask,
    deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const taskValidation = [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('project').notEmpty().withMessage('Project is required')
];

const statusValidation = [
    body('status').isIn(['todo', 'in-progress', 'review', 'done']).withMessage('Invalid status')
];

const moveValidation = [
    body('status').isIn(['todo', 'in-progress', 'review', 'done']).withMessage('Invalid status'),
    body('position').isInt({ min: 0 }).withMessage('Position must be a positive integer')
];

// Routes
router.get('/', protect, getTasks);
router.get('/:id', protect, getTask);
router.post('/', protect, taskValidation, validate, createTask);
router.put('/:id', protect, updateTask);
router.patch('/:id/status', protect, statusValidation, validate, updateTaskStatus);
router.patch('/:id/move', protect, moveValidation, validate, moveTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
