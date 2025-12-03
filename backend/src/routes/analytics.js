const express = require('express');
const router = express.Router();
const {
    getOverview,
    getTaskAnalytics,
    getMilestoneAnalytics,
    getVelocity
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// Routes
router.get('/overview', protect, getOverview);
router.get('/tasks', protect, getTaskAnalytics);
router.get('/milestones', protect, getMilestoneAnalytics);
router.get('/velocity', protect, getVelocity);

module.exports = router;
