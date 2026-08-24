const express = require('express');
const router = express.Router();
const {
  getPremiumDashboardStats,
  getPremiumContent,
  createPremiumContent,
  getPremiumContentById,
  updatePremiumContent,
  deletePremiumContent,
  publishPremiumContent,
  unpublishPremiumContent,
  getPremiumMembers,
  createPremiumMember,
  getPremiumMemberById,
  updatePremiumMember,
  renewPremiumMember,
  blockPremiumMember,
  unblockPremiumMember,
  changePremiumMemberPassword,
  getUpgradeRequests,
  approveUpgradeRequest,
  rejectUpgradeRequest,
  getPremiumReports,
} = require('../../../../controllers/premiumAdminController');
const { protectAdmin } = require('../../../../middleware/authMiddleware');
const { uploadMedia } = require('../../../../middleware/uploadMiddleware');

// Protect all admin premium routes
router.use(protectAdmin);

// Dashboard
router.get('/dashboard', getPremiumDashboardStats);

// Content Routes
router.get('/content', getPremiumContent);
router.post('/content', uploadMedia.single('media'), createPremiumContent);
router.get('/content/:id', getPremiumContentById);
router.put('/content/:id', uploadMedia.single('media'), updatePremiumContent);
router.delete('/content/:id', deletePremiumContent);
router.post('/content/:id/publish', publishPremiumContent);
router.post('/content/:id/unpublish', unpublishPremiumContent);

// Members Routes
router.get('/members', getPremiumMembers);
router.post('/members', createPremiumMember);
router.get('/members/:id', getPremiumMemberById);
router.put('/members/:id', updatePremiumMember);
router.post('/members/:id/renew', renewPremiumMember);
router.post('/members/:id/block', blockPremiumMember);
router.post('/members/:id/unblock', unblockPremiumMember);
router.post('/members/:id/change-password', changePremiumMemberPassword);

// Upgrade Requests Routes
router.get('/upgrade-requests', getUpgradeRequests);
router.post('/upgrade-requests/:id/approve', approveUpgradeRequest);
router.post('/upgrade-requests/:id/reject', rejectUpgradeRequest);

// Activity Reports
router.get('/reports', getPremiumReports);

module.exports = router;
