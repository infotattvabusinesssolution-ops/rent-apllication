const express = require('express');
const router = express.Router();

const {
  getAds,
  getAdById,
  postAd,
  getMyAds,
  updateMyAd,
  deleteMyAd,
} = require('../../../../controllers/user/userAdController');

const {
  requestCallback,
  submitReport,
  registerVisitorWin,
  submitSubscription,
} = require('../../../../controllers/user/userInteractionController');

const upload = require('../../../../middleware/uploadMiddleware');

// Ads & Marketplace Routes
router.get('/ads', getAds);
router.get('/ads/:id', getAdById);
router.post('/ads', upload.array('images', 10), postAd);
router.get('/my-ads', getMyAds);
router.put('/my-ads/:id', upload.array('images', 10), updateMyAd);
router.delete('/my-ads/:id', deleteMyAd);



// Lead Callback, Report, Visitor Win & Subscription Routes
router.post('/callback', requestCallback);
router.post('/report', submitReport);
router.post('/visitor-win', registerVisitorWin);
router.post('/subscription', submitSubscription);

module.exports = router;
