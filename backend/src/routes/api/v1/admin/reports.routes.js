const express = require('express');
const router = express.Router();
const {
  getReports,
  getReportById,
  dismissReport,
  takeDownAdFromReport,
} = require('../../../../controllers/reportController');
const { protectAdmin } = require('../../../../middleware/authMiddleware');

router.get('/', protectAdmin, getReports);
router.get('/:id', protectAdmin, getReportById);
router.post('/:id/dismiss', protectAdmin, dismissReport);
router.post('/:id/takedown', protectAdmin, takeDownAdFromReport);

module.exports = router;
