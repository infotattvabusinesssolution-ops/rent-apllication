const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../../../../middleware/authMiddleware');

const {
  createLuckyDraw,
  getLuckyDraws,
  getLuckyDrawById,
  updateLuckyDraw,
  publishLuckyDraw,
  unpublishLuckyDraw,
  closeLuckyDraw,
  cancelLuckyDraw,
  getLuckyDrawStats,
} = require('../../../../controllers/luckyDrawController');

const {
  createPrize,
  getPrizes,
  updatePrize,
  deletePrize,
} = require('../../../../controllers/luckyDrawPrizeController');

const {
  getDrawEntries,
  getDrawPayments,
} = require('../../../../controllers/luckyDrawEntryController');

const {
  startDraw,
  getDrawResult,
  verifyResult,
  publishResult,
  getWinners,
} = require('../../../../controllers/luckyDrawWinnerController');

const { getAuditLogs } = require('../../../../controllers/luckyDrawAuditController');
const { getLuckyDrawEnquiries, updateEnquiryStatus } = require('../../../../controllers/luckyDrawEnquiryController');

// Apply admin protection middleware to all admin lucky draw routes
router.use(protectAdmin);

// Dashboard KPIs & Global Lists
router.get('/stats/overview', getLuckyDrawStats);
router.get('/audit-logs', getAuditLogs);
router.get('/winners', getWinners);
router.get('/entries', getDrawEntries);
router.get('/payments', getDrawPayments);

// Lucky Draw Visitor Enquiries
router.get('/enquiries', getLuckyDrawEnquiries);
router.patch('/enquiries/:id', updateEnquiryStatus);

// Main Draw CRUD
router.get('/', getLuckyDraws);
router.post('/', createLuckyDraw);
router.get('/:id', getLuckyDrawById);
router.put('/:id', updateLuckyDraw);
router.post('/:id/publish', publishLuckyDraw);
router.post('/:id/unpublish', unpublishLuckyDraw);
router.post('/:id/close', closeLuckyDraw);
router.post('/:id/cancel', cancelLuckyDraw);

// Draw Prizes
router.get('/:id/prizes', getPrizes);
router.post('/:id/prizes', createPrize);
router.put('/:id/prizes/:prizeId', updatePrize);
router.delete('/:id/prizes/:prizeId', deletePrize);

// Draw Entries & Payments
router.get('/:id/entries', getDrawEntries);
router.get('/:id/payments', getDrawPayments);

// System Winner Selection Engine & Verification
router.post('/:id/run-draw', startDraw);
router.get('/:id/result', getDrawResult);
router.post('/:id/verify-result', verifyResult);
router.post('/:id/publish-result', publishResult);

module.exports = router;
