const Task = require('../models/Task');
const Project = require('../models/Project');
const { formatSuccess, formatError, paginate, getPaginationMeta } = require('../utils/helpers');
const { emitToProject } = require('../config/socket');
const logger = require('../utils/logger');

/**
 * @desc    Get all tasks with filters
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res) => {
    try {
        const { project, status, priority, assignee, page = 1, limit = 50 } = req.query;

        // Build query
        const query = {};
        if (project) query.project = project;
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignee) query.assignee = assignee;

        // Get pagination
        const { skip, limit: pageLimit } = paginate(page, limit);

        // Get tasks
        const tasks = await Task.find(query)
            .populate('assignee', 'name email avatar')
            .populate('createdBy', 'name email')
            .populate('project', 'name color')
            .sort('position')
            .skip(skip)
            .limit(pageLimit);

        const total = await Task.countDocuments(query);

        res.json(formatSuccess({
            tasks,
            pagination: getPaginationMeta(total, page, pageLimit)
        }));
    } catch (error) {
        logger.error(`Get tasks error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignee', 'name email avatar')
            .populate('createdBy', 'name email avatar')
            .populate('project', 'name color')
            .populate('milestone', 'title')
            .populate('attachments');

        if (!task) {
            return res.status(404).json(formatError('Task not found', 404));
        }

        res.json(formatSuccess(task));
    } catch (error) {
        logger.error(`Get task error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};


const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, project, assignee, dueDate, tags, milestone } = req.body;

        // Verify project exists and user has access
        const projectDoc = await Project.findById(project);
        if (!projectDoc) {
            return res.status(404).json(formatError('Project not found', 404));
        }

        // Get max position for this project/status
        const maxPosTask = await Task.findOne({ project, status: status || 'todo' })
            .sort('-position')
            .select('position');
        const position = maxPosTask ? maxPosTask.position + 1 : 0;

        const task = await Task.create({
            title,
            description,
            status: status || 'todo',
            priority: priority || 'medium',
            project,
            assignee,
            dueDate,
            tags,
            milestone,
            position,
            createdBy: req.user.id
        });

        const populatedTask = await Task.findById(task._id)
            .populate('assignee', 'name email avatar')
            .populate('createdBy', 'name email avatar')
            .populate('project', 'name color');

        // Emit real-time event
        emitToProject(project, 'task:created', populatedTask);

        logger.info(`Task created: ${title} in project ${project}`);

        res.status(201).json(formatSuccess(populatedTask, 'Task created successfully'));
    } catch (error) {
        logger.error(`Create task error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};


const updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json(formatError('Task not found', 404));
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('assignee', 'name email avatar')
            .populate('createdBy', 'name email avatar')
            .populate('project', 'name color');

        // Emit real-time event
        emitToProject(task.project._id, 'task:updated', task);

        logger.info(`Task updated: ${task.title}`);

        res.json(formatSuccess(task, 'Task updated successfully'));
    } catch (error) {
        logger.error(`Update task error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};


const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json(formatError('Task not found', 404));
        }

        task.status = status;
        await task.save();

        task = await Task.findById(task._id)
            .populate('assignee', 'name email avatar')
            .populate('project', 'name color');

        // Emit real-time event
        emitToProject(task.project._id, 'task:updated', task);

        res.json(formatSuccess(task, 'Task status updated'));
    } catch (error) {
        logger.error(`Update task status error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};


const moveTask = async (req, res) => {
    try {
        const { status, position } = req.body;

        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json(formatError('Task not found', 404));
        }

        const oldStatus = task.status;
        task.status = status;
        task.position = position;
        await task.save();

        // Reorder other tasks
        if (oldStatus !== status) {
            await Task.updateMany(
                { project: task.project, status, position: { $gte: position }, _id: { $ne: task._id } },
                { $inc: { position: 1 } }
            );
        }

        task = await Task.findById(task._id)
            .populate('assignee', 'name email avatar')
            .populate('project', 'name color');

        // Emit real-time event
        emitToProject(task.project._id, 'task:moved', task);

        res.json(formatSuccess(task, 'Task moved successfully'));
    } catch (error) {
        logger.error(`Move task error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};


const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json(formatError('Task not found', 404));
        }

        const projectId = task.project;
        await task.deleteOne();

        // Emit real-time event
        emitToProject(projectId, 'task:deleted', { id: req.params.id });

        logger.info(`Task deleted: ${task.title}`);

        res.json(formatSuccess(null, 'Task deleted successfully'));
    } catch (error) {
        logger.error(`Delete task error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    updateTaskStatus,
    moveTask,
    deleteTask
};
