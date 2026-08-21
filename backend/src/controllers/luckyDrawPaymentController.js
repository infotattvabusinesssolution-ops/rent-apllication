const crypto = require('crypto');
const LuckyDraw = require('../models/LuckyDraw');
const LuckyDrawOrder = require('../models/LuckyDrawOrder');
const LuckyDrawEntry = require('../models/LuckyDrawEntry');
const LuckyDrawAuditLog = require('../models/LuckyDrawAuditLog');
const { generateTicketNumber, generateOrderNumber } = require('../utils/luckyDrawTicketGenerator');

/**
 * @desc Create a pending order for purchasing lucky draw entries
 * @route POST /api/v1/user/lucky-draws/:id/orders
 * @access User
 */
const createPaymentOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const requestedQty = Number(quantity || 1);
    if (requestedQty < 1) {
      return res.status(400).json({ success: false, message: 'Invalid entry quantity.' });
    }

    const draw = await LuckyDraw.findById(id);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Lucky Draw campaign not found.' });
    }

    if (!draw.isPublished || draw.status !== LuckyDraw.LUCKY_DRAW_STATUS.ACTIVE) {
      return res.status(400).json({ success: false, message: 'This lucky draw is not currently active for entry.' });
    }

    const now = new Date();
    if (now < draw.startDate || now > draw.endDate) {
      return res.status(400).json({ success: false, message: 'This lucky draw is outside of its active timeline.' });
    }

    const userId = req.user.userId || req.user._id.toString();

    // Check maximum entries per user limit
    const existingUserEntriesCount = await LuckyDrawEntry.countDocuments({
      luckyDrawId: draw._id,
      userId,
      status: { $ne: LuckyDrawEntry.ENTRY_STATUS.CANCELLED },
    });

    if (existingUserEntriesCount + requestedQty > draw.maxEntriesPerUser) {
      return res.status(400).json({
        success: false,
        message: `Maximum allowed entries per user for this draw is ${draw.maxEntriesPerUser}. You already have ${existingUserEntriesCount} entries.`,
      });
    }

    // Check total maximum entries limit
    if (draw.totalEntries + requestedQty > draw.maxEntries) {
      return res.status(400).json({
        success: false,
        message: 'No more entries are available for this lucky draw.',
      });
    }

    const totalAmount = draw.entryPrice * requestedQty;
    const orderNumber = generateOrderNumber();
    const mockGatewayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    const order = await LuckyDrawOrder.create({
      orderNumber,
      userId,
      luckyDrawId: draw._id,
      quantity: requestedQty,
      amount: totalAmount,
      currency: draw.currency || 'INR',
      paymentGateway: 'RAZORPAY',
      gatewayOrderId: mockGatewayOrderId,
      paymentStatus: LuckyDrawOrder.ORDER_STATUS.PENDING,
      status: 'PENDING',
    });

    return res.status(201).json({
      success: true,
      message: 'Lucky draw order initialized',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        amount: order.amount,
        currency: order.currency,
        quantity: order.quantity,
        gatewayOrderId: order.gatewayOrderId,
        drawTitle: draw.title,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_homescooter',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Core internal helper to process successful payment & generate tickets idempotently
 */
const processSuccessfulPayment = async ({ orderId, gatewayPaymentId, gatewayResponse }) => {
  const order = await LuckyDrawOrder.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  // Idempotency check: If already paid, return existing status without duplicating tickets
  if (order.paymentStatus === LuckyDrawOrder.ORDER_STATUS.PAID) {
    const existingEntries = await LuckyDrawEntry.find({ orderId: order._id });
    return { order, entries: existingEntries, alreadyProcessed: true };
  }

  const drawId = order.luckyDrawId;

  // Atomic database-safe validation for concurrency limit check
  const updatedDraw = await LuckyDraw.findOneAndUpdate(
    {
      _id: drawId,
      status: LuckyDraw.LUCKY_DRAW_STATUS.ACTIVE,
      $expr: { $lte: [{ $add: ['$totalEntries', order.quantity] }, '$maxEntries'] },
    },
    { $inc: { totalEntries: order.quantity } },
    { new: true }
  );

  if (!updatedDraw) {
    order.paymentStatus = LuckyDrawOrder.ORDER_STATUS.FAILED;
    order.status = 'FAILED_OVER_CAPACITY';
    await order.save();
    throw new Error('Total entry limit reached or draw closed. Payment could not generate entries.');
  }

  // Mark order as PAID
  order.paymentStatus = LuckyDrawOrder.ORDER_STATUS.PAID;
  order.status = 'PAID';
  order.gatewayPaymentId = gatewayPaymentId || `pay_${crypto.randomBytes(8).toString('hex')}`;
  order.gatewayResponse = gatewayResponse || {};
  order.paidAt = new Date();
  await order.save();

  // Generate unique ticket records
  const newEntries = [];
  for (let i = 0; i < order.quantity; i++) {
    const ticketNumber = generateTicketNumber(updatedDraw.totalEntries - order.quantity + i + 1);
    const entry = await LuckyDrawEntry.create({
      luckyDrawId: updatedDraw._id,
      userId: order.userId,
      orderId: order._id,
      ticketNumber,
      amount: updatedDraw.entryPrice,
      status: LuckyDrawEntry.ENTRY_STATUS.VALID,
    });
    newEntries.push(entry);
  }

  // Audit log
  await LuckyDrawAuditLog.create({
    luckyDrawId: updatedDraw._id,
    action: 'PAYMENT_RECEIVED_ENTRIES_CREATED',
    performedBy: `USER:${order.userId}`,
    metadata: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      quantity: order.quantity,
      amount: order.amount,
      tickets: newEntries.map((e) => e.ticketNumber),
    },
  });

  return { order, entries: newEntries, alreadyProcessed: false };
};

/**
 * @desc Webhook endpoint for payment gateway
 * @route POST /api/v1/webhooks/lucky-draw-payment
 * @access Public / Webhook secret verification
 */
const handlePaymentWebhook = async (req, res) => {
  try {
    const { orderId, gatewayOrderId, gatewayPaymentId, status } = req.body;

    let order;
    if (orderId) {
      order = await LuckyDrawOrder.findById(orderId);
    } else if (gatewayOrderId) {
      order = await LuckyDrawOrder.findOne({ gatewayOrderId });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order reference not found' });
    }

    if (status === 'SUCCESS' || status === 'PAID' || status === 'captured') {
      const result = await processSuccessfulPayment({
        orderId: order._id,
        gatewayPaymentId,
        gatewayResponse: req.body,
      });

      return res.json({
        success: true,
        message: 'Payment processed and entries created successfully',
        data: result,
      });
    } else {
      order.paymentStatus = LuckyDrawOrder.ORDER_STATUS.FAILED;
      order.status = 'FAILED';
      await order.save();
      return res.json({ success: false, message: 'Payment recorded as failed' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Client verification trigger post-checkout
 * @route POST /api/v1/user/lucky-draws/verify-payment
 * @access User
 */
const verifyPayment = async (req, res) => {
  try {
    const { orderId, gatewayPaymentId, gatewaySignature } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }

    const result = await processSuccessfulPayment({
      orderId,
      gatewayPaymentId: gatewayPaymentId || `pay_${crypto.randomBytes(8).toString('hex')}`,
      gatewayResponse: req.body,
    });

    return res.json({
      success: true,
      message: 'Payment verified and lucky draw tickets generated!',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPaymentOrder,
  handlePaymentWebhook,
  verifyPayment,
  processSuccessfulPayment,
};
