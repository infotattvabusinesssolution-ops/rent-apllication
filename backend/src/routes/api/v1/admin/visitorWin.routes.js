const express = require('express');
const router = express.Router();
const {
  getRegistrations,
  deleteRegistration,
  exportVisitorWin,
} = require('../../../../controllers/visitorWinController');
const { protectAdmin } = require('../../../../middleware/authMiddleware');

router.get('/', protectAdmin, getRegistrations);
router.get('/export', protectAdmin, exportVisitorWin);
router.delete('/:id', protectAdmin, deleteRegistration);

module.exports = router;
