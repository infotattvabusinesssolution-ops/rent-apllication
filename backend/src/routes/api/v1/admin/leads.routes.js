const express = require('express');
const router = express.Router();
const { getLeads, updateLeadStatus, exportLeads } = require('../../../../controllers/leadController');
const { protectAdmin } = require('../../../../middleware/authMiddleware');

router.get('/', protectAdmin, getLeads);
router.get('/export', protectAdmin, exportLeads);
router.patch('/:id', protectAdmin, updateLeadStatus);

module.exports = router;
