const express = require('express');
const router = express.Router();
const {
  premiumLogin,
  premiumLogout,
  getProfile,
  getMembershipDetails,
  getPublicPremiumInfo,
  getPremiumContent,
  getPremiumContentById,
  submitUpgradeRequest,
} = require('../../../../controllers/premiumUserController');
const { protectPremium } = require('../../../../middleware/premiumAuthMiddleware');
const upload = require('../../../../middleware/uploadMiddleware');

// Public Routes
router.post('/auth/login', premiumLogin);
router.get('/public-info', getPublicPremiumInfo);
router.post('/upgrade-request', upload.single('paymentScreenshot'), submitUpgradeRequest);

// Protected Premium Member Routes
router.use(protectPremium);
router.post('/auth/logout', premiumLogout);
router.get('/profile', getProfile);
router.get('/membership', getMembershipDetails);
router.get('/content', getPremiumContent);
router.get('/content/:id', getPremiumContentById);

module.exports = router;
