const express = require('express');
const router = express.Router();
const { protectUser } = require('../../../../middleware/authMiddleware');

const {
  getLuckyDraws,
  getLuckyDrawById,
} = require('../../../../controllers/luckyDrawController');

const { getPrizes } = require('../../../../controllers/luckyDrawPrizeController');

const {
  createPaymentOrder,
  verifyPayment,
} = require('../../../../controllers/luckyDrawPaymentController');

const {
  getUserEntries,
} = require('../../../../controllers/luckyDrawEntryController');

const {
  getDrawResult,
  getWinners,
} = require('../../../../controllers/luckyDrawWinnerController');

// Public endpoints (Browse catalog, detail, prizes, result)
router.get('/', getLuckyDraws);
router.get('/my-winners', getWinners);
router.get('/:id', getLuckyDrawById);
router.get('/:id/prizes', getPrizes);
router.get('/:id/result', getDrawResult);

// Protected User endpoints (Order creation, tickets, payment verification)
router.post('/verify-payment', protectUser, verifyPayment);
router.post('/:id/orders', protectUser, createPaymentOrder);
router.get('/user/my-entries', protectUser, getUserEntries);

module.exports = router;
