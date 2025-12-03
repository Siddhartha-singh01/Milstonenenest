const Project = require('../models/Project');
const Task = require('../models/Task');
const { formatSuccess, formatError, generateRandomColor } = require('../utils/helpers');
const { emitToProject } = require('../config/socket');
const logger = require('../utils/logger');


const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user.id },
                { members: req.user.id }
            ]
        }).populate('owner', 'name email avatar')
            .populate('members', 'name email avatar')
            .sort('-createdAt');

        res.json(formatSuccess(projects));
    } catch (error) {
        logger.error(`Get projects error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar');

        if (!project) {
            return res.status(404).json(formatError('Project not found', 404));
        }

        // Check if user has access
        const hasAccess = project.owner._id.toString() === req.user.id ||
            project.members.some(member => member._id.toString() === req.user.id);

        if (!hasAccess) {
            return res.status(403).json(formatError('Not authorized to access this project', 403));
        }

        res.json(formatSuccess(project));
    } catch (error) {
        logger.error(`Get project error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Create new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = async (req, res) => {
    try {
        const { name, description, color, members } = req.body;

        const project = await Project.create({
            name,
            description,
            color: color || generateRandomColor(),
            owner: req.user.id,
            members: members || []
        });

        const populatedProject = await Project.findById(project._id)
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar');

        logger.info(`Project created: ${name} by ${req.user.email}`);

        res.status(201).json(formatSuccess(populatedProject, 'Project created successfully'));
    } catch (error) {
        logger.error(`Create project error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json(formatError('Project not found', 404));
        }

        // Check if user is owner
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json(formatError('Not authorized to update this project', 403));
        }

        project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('owner', 'name email avatar')
            .populate('members', 'name email avatar');

        logger.info(`Project updated: ${project.name}`);

        res.json(formatSuccess(project, 'Project updated successfully'));
    } catch (error) {
        logger.error(`Update project error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json(formatError('Project not found', 404));
        }

        // Check if user is owner
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json(formatError('Not authorized to delete this project', 403));
        }

        // Delete all tasks in project
        await Task.deleteMany({ project: req.params.id });

        await project.deleteOne();

        logger.info(`Project deleted: ${project.name}`);

        res.json(formatSuccess(null, 'Project deleted successfully'));
    } catch (error) {
        logger.error(`Delete project error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
};
