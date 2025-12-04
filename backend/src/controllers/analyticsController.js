const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const { formatSuccess, formatError } = require('../utils/helpers');
const logger = require('../utils/logger');

const getOverview = async (req, res) => {
    try {
        const { projectId } = req.query;

        // Build query based on user's projects
        const projectQuery = projectId       
            ? { _id: projectId }
            : { $or: [{ owner: req.user.id }, { members: req.user.id }] };

        const projects = await Project.find(projectQuery).select('_id');
        const projectIds = projects.map(p => p._id);

        // Get task statistics
        const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
        const completedTasks = await Task.countDocuments({
            project: { $in: projectIds },
            status: 'done'
        });
        const inProgressTasks = await Task.countDocuments({
            project: { $in: projectIds },
            status: 'in-progress'
        });
        const todoTasks = await Task.countDocuments({
            project: { $in: projectIds },
            status: 'todo'
        });

        // Get milestone statistics
        const totalMilestones = await Milestone.countDocuments({ project: { $in: projectIds } });
        const completedMilestones = await Milestone.countDocuments({
            project: { $in: projectIds },
            status: 'completed'
        });

        // Get overdue tasks
        const overdueTasks = await Task.countDocuments({
            project: { $in: projectIds },
            dueDate: { $lt: new Date() },
            status: { $ne: 'done' }
        });

        // Calculate completion rate
        const completionRate = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        res.json(formatSuccess({
            tasks: {
                total: totalTasks,
                completed: completedTasks,
                inProgress: inProgressTasks,
                todo: todoTasks,
                overdue: overdueTasks,
                completionRate
            },
            milestones: {
                total: totalMilestones,
                completed: completedMilestones
            },
            projects: {
                total: projects.length
            }
        }));
    } catch (error) {
        logger.error(`Get overview analytics error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Get task analytics
 * @route   GET /api/analytics/tasks
 * @access  Private
 */
const getTaskAnalytics = async (req, res) => {
    try {
        const { projectId } = req.query;

        const projectQuery = projectId
            ? { _id: projectId }
            : { $or: [{ owner: req.user.id }, { members: req.user.id }] };

        const projects = await Project.find(projectQuery).select('_id');
        const projectIds = projects.map(p => p._id);

        // Tasks by status
        const tasksByStatus = await Task.aggregate([
            { $match: { project: { $in: projectIds } } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Tasks by priority
        const tasksByPriority = await Task.aggregate([
            { $match: { project: { $in: projectIds } } },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        // Tasks created per day (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const tasksOverTime = await Task.aggregate([
            {
                $match: {
                    project: { $in: projectIds },
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(formatSuccess({
            byStatus: tasksByStatus,
            byPriority: tasksByPriority,
            overTime: tasksOverTime
        }));
    } catch (error) {
        logger.error(`Get task analytics error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Get milestone analytics
 * @route   GET /api/analytics/milestones
 * @access  Private
 */
const getMilestoneAnalytics = async (req, res) => {
    try {
        const { projectId } = req.query;

        const projectQuery = projectId
            ? { _id: projectId }
            : { $or: [{ owner: req.user.id }, { members: req.user.id }] };

        const projects = await Project.find(projectQuery).select('_id');
        const projectIds = projects.map(p => p._id);

        // Milestones by status
        const milestonesByStatus = await Milestone.aggregate([
            { $match: { project: { $in: projectIds } } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Average progress
        const progressStats = await Milestone.aggregate([
            { $match: { project: { $in: projectIds } } },
            {
                $group: {
                    _id: null,
                    avgProgress: { $avg: '$progress' },
                    totalProgress: { $sum: '$progress' }
                }
            }
        ]);

        // Upcoming milestones
        const upcomingMilestones = await Milestone.find({
            project: { $in: projectIds },
            dueDate: { $gte: new Date() },
            status: { $ne: 'completed' }
        })
            .sort('dueDate')
            .limit(5)
            .populate('project', 'name color');

        res.json(formatSuccess({
            byStatus: milestonesByStatus,
            progress: progressStats[0] || { avgProgress: 0, totalProgress: 0 },
            upcoming: upcomingMilestones
        }));
    } catch (error) {
        logger.error(`Get milestone analytics error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Get team velocity (tasks completed per week)
 * @route   GET /api/analytics/velocity
 * @access  Private
 */
const getVelocity = async (req, res) => {
    try {
        const { projectId } = req.query;

        const projectQuery = projectId
            ? { _id: projectId }
            : { $or: [{ owner: req.user.id }, { members: req.user.id }] };

        const projects = await Project.find(projectQuery).select('_id');
        const projectIds = projects.map(p => p._id);

        // Get completed tasks per week for last 8 weeks
        const eightWeeksAgo = new Date();
        eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

        const velocity = await Task.aggregate([
            {
                $match: {
                    project: { $in: projectIds },
                    status: 'done',
                    updatedAt: { $gte: eightWeeksAgo }
                }
            },
            {
                $group: {
                    _id: {
                        week: { $week: '$updatedAt' },
                        year: { $year: '$updatedAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.week': 1 } }
        ]);

        res.json(formatSuccess(velocity));
    } catch (error) {
        logger.error(`Get velocity analytics error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

module.exports = {
    getOverview,
    getTaskAnalytics,
    getMilestoneAnalytics,
    getVelocity
};
