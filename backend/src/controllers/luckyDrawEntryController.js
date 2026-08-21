const LuckyDrawEntry = require('../models/LuckyDrawEntry');
const LuckyDrawOrder = require('../models/LuckyDrawOrder');
const User = require('../models/User');

/**
 * @desc Get entries belonging to the authenticated user
 * @route GET /api/v1/user/lucky-draws/my-entries
 * @access User
 */
const getUserEntries = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id.toString();
    const entries = await LuckyDrawEntry.find({ userId })
      .populate('luckyDrawId', 'title slug bannerImage status endDate drawDate entryPrice')
      .populate('prizeId', 'title rank prizeValue image')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: entries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Admin server-paginated query for draw entries
 * @route GET /api/v1/admin/lucky-draws/:id/entries or GET /api/v1/admin/lucky-draws/entries
 * @access Admin
 */
const getDrawEntries = async (req, res) => {
  try {
    const { id } = req.params;
    const { ticketNumber, status, isWinner, page = 1, limit = 50 } = req.query;

    const query = {};
    if (id && id !== 'all') {
      query.luckyDrawId = id;
    }

    if (ticketNumber) {
      query.ticketNumber = { $regex: ticketNumber, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }
    if (isWinner !== undefined) {
      query.isWinner = isWinner === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await LuckyDrawEntry.countDocuments(query);
    const entries = await LuckyDrawEntry.find(query)
      .populate('luckyDrawId', 'title slug')
      .populate('prizeId', 'title rank')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Enrich with user name/phone
    const enrichedEntries = await Promise.all(
      entries.map(async (e) => {
        const u = await User.findOne({ userId: e.userId }).select('name phone email');
        const obj = e.toObject();
        obj.userName = u ? u.name : 'User';
        obj.userPhone = u ? u.phone : '';
        obj.userEmail = u ? u.email : '';
        return obj;
      })
    );

    return res.json({
      success: true,
      data: enrichedEntries,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Admin server-paginated query for draw orders & payments
 * @route GET /api/v1/admin/lucky-draws/:id/payments or GET /api/v1/admin/lucky-draws/payments
 * @access Admin
 */
const getDrawPayments = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, search, page = 1, limit = 50 } = req.query;

    const query = {};
    if (id && id !== 'all') {
      query.luckyDrawId = id;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { gatewayPaymentId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await LuckyDrawOrder.countDocuments(query);
    const orders = await LuckyDrawOrder.find(query)
      .populate('luckyDrawId', 'title slug entryPrice')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const enrichedOrders = await Promise.all(
      orders.map(async (o) => {
        const u = await User.findOne({ userId: o.userId }).select('name phone email');
        const obj = o.toObject();
        obj.userName = u ? u.name : 'User';
        obj.userPhone = u ? u.phone : '';
        obj.userEmail = u ? u.email : '';
        return obj;
      })
    );

    return res.json({
      success: true,
      data: enrichedOrders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserEntries,
  getDrawEntries,
  getDrawPayments,
};
