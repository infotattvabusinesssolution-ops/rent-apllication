const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { SUBSCRIPTION_STATUS } = require('../config/constants');
const whatsAppService = require('../services/whatsAppService');

// @desc    Get all subscriptions
// @route   GET /api/v1/admin/subscriptions
// @access  Private (Admin)
const getSubscriptions = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (search) {
      const q = search.trim();
      query.$or = [
        { userName: { $regex: q, $options: 'i' } },
        { userPhone: { $regex: q, $options: 'i' } },
        { upiReference: { $regex: q, $options: 'i' } },
        { subId: { $regex: q, $options: 'i' } },
      ];
    }

    const subscriptions = await Subscription.find(query).sort({ createdAt: -1 });
    const formatted = subscriptions.map((s) => {
      const obj = s.toObject();
      return { ...obj, id: obj.subId };
    });

    return res.json({ success: true, data: formatted, total: formatted.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending subscriptions
// @route   GET /api/v1/admin/subscriptions/pending
// @access  Private (Admin)
const getPendingSubscriptions = async (req, res) => {
  try {
    const pending = await Subscription.find({ status: SUBSCRIPTION_STATUS.PENDING }).sort({ createdAt: -1 });
    const formatted = pending.map((s) => {
      const obj = s.toObject();
      return { ...obj, id: obj.subId };
    });

    return res.json({ success: true, data: formatted, total: formatted.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get subscription by ID
// @route   GET /api/v1/admin/subscriptions/:id
// @access  Private (Admin)
const getSubscriptionById = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ $or: [{ subId: req.params.id }, { _id: req.params.id }] });
    if (!sub) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    const obj = sub.toObject();
    return res.json({ success: true, ...obj, id: obj.subId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Activate subscription (Verify payment & generate credentials with 10 days access rule)
// @route   POST /api/v1/admin/subscriptions/:id/activate
// @access  Private (Admin)
const activateSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ $or: [{ subId: req.params.id }, { _id: req.params.id }] });
    if (!sub) {
      return res.status(404).json({ success: false, message: 'Subscription record not found' });
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedUsername = `MEMBER_${randomNum}`;
    const generatedPassword = `Pass#${randomNum}`;
    
    // 10 Days rule
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    sub.status = SUBSCRIPTION_STATUS.ACTIVATED;
    sub.activatedDate = now;
    sub.expiryDate = expiryDate;
    sub.generatedUsername = generatedUsername;
    sub.generatedPassword = generatedPassword;

    // Send WhatsApp dispatch
    const waResult = await whatsAppService.sendCredentials(
      sub.userPhone,
      generatedUsername,
      generatedPassword,
      expiryDate.toISOString()
    );

    sub.whatsAppSent = Boolean(waResult.success);
    await sub.save();

    // Update user profile status if present
    await User.findOneAndUpdate(
      { userId: sub.userId },
      { isSubscribed: true, subscriptionExpiry: expiryDate }
    );

    return res.json({
      success: true,
      generatedUsername,
      generatedPassword,
      expiryDate: expiryDate.toISOString(),
      whatsAppSent: sub.whatsAppSent,
      message: 'Subscription activated successfully. Credentials sent via WhatsApp.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject subscription
// @route   POST /api/v1/admin/subscriptions/:id/reject
// @access  Private (Admin)
const rejectSubscription = async (req, res) => {
  try {
    const { reason = '' } = req.body;
    const sub = await Subscription.findOne({ $or: [{ subId: req.params.id }, { _id: req.params.id }] });

    if (!sub) {
      return res.status(404).json({ success: false, message: 'Subscription record not found' });
    }

    sub.status = SUBSCRIPTION_STATUS.REJECTED;
    sub.rejectionReason = reason;
    await sub.save();

    return res.json({ success: true, message: 'Subscription payment rejected' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSubscriptions,
  getPendingSubscriptions,
  getSubscriptionById,
  activateSubscription,
  rejectSubscription,
};
