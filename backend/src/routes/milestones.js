const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getMilestones,
    getMilestone,
    createMilestone,
    updateMilestone,
    completeMilestone,
    deleteMilestone
} = require('../controllers/milestoneController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const milestoneValidation = [
    body('title').trim().notEmpty().withMessage('Milestone title is required'),
    body('project').notEmpty().withMessage('Project is required'),
    body('dueDate').isISO8601().withMessage('Valid due date is required')
];

// Routes
router.get('/', protect, getMilestones);
router.get('/:id', protect, getMilestone);
router.post('/', protect, milestoneValidation, validate, createMilestone);
router.put('/:id', protect, updateMilestone);
router.patch('/:id/complete', protect, completeMilestone);
router.delete('/:id', protect, deleteMilestone);

module.exports = router;
