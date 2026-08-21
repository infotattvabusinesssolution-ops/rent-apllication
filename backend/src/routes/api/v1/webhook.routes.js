const express = require('express');
const router = express.Router();
const { handlePaymentWebhook } = require('../../../controllers/luckyDrawPaymentController');

// Webhook endpoint for server-side payment verification
router.post('/lucky-draw-payment', handlePaymentWebhook);

module.exports = router;
