const Milestone = require('../models/Milestone');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { formatSuccess, formatError } = require('../utils/helpers');
const { emitToProject } = require('../config/socket');
const logger = require('../utils/logger');


const getMilestones = async (req, res) => {
    try {
        const { project, status } = req.query;

        const query = {};
        if (project) query.project = project;
        if (status) query.status = status;

        const milestones = await Milestone.find(query)
            .populate('project', 'name color')
            .populate('createdBy', 'name email')
            .populate('tasks')
            .sort('dueDate');

        res.json(formatSuccess(milestones));
    } catch (error) {
        logger.error(`Get milestones error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Get single milestone
 * @route   GET /api/milestones/:id
 * @access  Private
 */
const getMilestone = async (req, res) => {
    try {
        const milestone = await Milestone.findById(req.params.id)
            .populate('project', 'name color')
            .populate('createdBy', 'name email avatar')
            .populate({
                path: 'tasks',
                populate: { path: 'assignee', select: 'name email avatar' }
            });

        if (!milestone) {
            return res.status(404).json(formatError('Milestone not found', 404));
        }

        res.json(formatSuccess(milestone));
    } catch (error) {
        logger.error(`Get milestone error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Create new milestone
 * @route   POST /api/milestones
 * @access  Private
 */
const createMilestone = async (req, res) => {
    try {
        const { title, description, project, dueDate, color } = req.body;

        // Verify project exists
        const projectDoc = await Project.findById(project);
        if (!projectDoc) {
            return res.status(404).json(formatError('Project not found', 404));
        }

        const milestone = await Milestone.create({
            title,
            description,
            project,
            dueDate,
            color,
            createdBy: req.user.id
        });

        const populatedMilestone = await Milestone.findById(milestone._id)
            .populate('project', 'name color')
            .populate('createdBy', 'name email');

        // Emit real-time event
        emitToProject(project, 'milestone:created', populatedMilestone);

        logger.info(`Milestone created: ${title} in project ${project}`);

        res.status(201).json(formatSuccess(populatedMilestone, 'Milestone created successfully'));
    } catch (error) {
        logger.error(`Create milestone error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Update milestone
 * @route   PUT /api/milestones/:id
 * @access  Private
 */
const updateMilestone = async (req, res) => {
    try {
        let milestone = await Milestone.findById(req.params.id);

        if (!milestone) {
            return res.status(404).json(formatError('Milestone not found', 404));
        }

        milestone = await Milestone.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('project', 'name color')
            .populate('createdBy', 'name email');

        // Recalculate progress
        await milestone.calculateProgress();
        await milestone.save();

        // Emit real-time event
        emitToProject(milestone.project._id, 'milestone:updated', milestone);

        logger.info(`Milestone updated: ${milestone.title}`);

        res.json(formatSuccess(milestone, 'Milestone updated successfully'));
    } catch (error) {
        logger.error(`Update milestone error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Mark milestone as complete
 * @route   PATCH /api/milestones/:id/complete
 * @access  Private
 */
const completeMilestone = async (req, res) => {
    try {
        let milestone = await Milestone.findById(req.params.id);

        if (!milestone) {
            return res.status(404).json(formatError('Milestone not found', 404));
        }

        milestone.status = 'completed';
        milestone.completedDate = new Date();
        milestone.progress = 100;
        await milestone.save();

        milestone = await Milestone.findById(milestone._id)
            .populate('project', 'name color');

        // Emit real-time event
        emitToProject(milestone.project._id, 'milestone:updated', milestone);

        res.json(formatSuccess(milestone, 'Milestone marked as complete'));
    } catch (error) {
        logger.error(`Complete milestone error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Delete milestone
 * @route   DELETE /api/milestones/:id
 * @access  Private
 */
const deleteMilestone = async (req, res) => {
    try {
        const milestone = await Milestone.findById(req.params.id);

        if (!milestone) {
            return res.status(404).json(formatError('Milestone not found', 404));
        }

        // Remove milestone reference from tasks
        await Task.updateMany(
            { milestone: req.params.id },
            { $unset: { milestone: 1 } }
        );

        const projectId = milestone.project;
        await milestone.deleteOne();

        // Emit real-time event
        emitToProject(projectId, 'milestone:deleted', { id: req.params.id });

        logger.info(`Milestone deleted: ${milestone.title}`);

        res.json(formatSuccess(null, 'Milestone deleted successfully'));
    } catch (error) {
        logger.error(`Delete milestone error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

module.exports = {
    getMilestones,
    getMilestone,
    createMilestone,
    updateMilestone,
    completeMilestone,
    deleteMilestone
};
