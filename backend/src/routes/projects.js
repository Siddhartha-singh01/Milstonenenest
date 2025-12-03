const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const projectValidation = [
    body('name').trim().notEmpty().withMessage('Project name is required')
];

// Routes
router.get('/', protect, getProjects);
router.get('/:id', protect, getProject);
router.post('/', protect, projectValidation, validate, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
