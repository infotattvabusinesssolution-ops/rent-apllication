const express = require('express');
const router = express.Router();
const { getDashboardStats, getAnalytics } = require('../../../../controllers/analyticsController');
const { protectAdmin } = require('../../../../middleware/authMiddleware');

router.get('/dashboard', protectAdmin, getDashboardStats);
router.get('/', protectAdmin, getAnalytics);

module.exports = router;
