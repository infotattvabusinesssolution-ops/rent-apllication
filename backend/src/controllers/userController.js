const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const { filter, search } = req.query;
    const query = {};

    if (filter === 'VERIFIED') {
      query.isVerified = true;
    } else if (filter === 'SUBSCRIBED') {
      query.isSubscribed = true;
    } else if (filter === 'BANNED') {
      query.status = 'Banned';
    }

    if (search) {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { userId: { $regex: q, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    const formatted = users.map((u) => {
      const obj = u.toObject();
      return { ...obj, id: obj.userId };
    });

    return res.json({ success: true, data: formatted, total: formatted.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/v1/admin/users/:id
// @access  Private (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ $or: [{ userId: req.params.id }, { _id: req.params.id }] });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const obj = user.toObject();
    return res.json({ success: true, ...obj, id: obj.userId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ban user
// @route   POST /api/v1/admin/users/:id/ban
// @access  Private (Admin)
const banUser = async (req, res) => {
  try {
    const { reason = '' } = req.body;
    const user = await User.findOne({ $or: [{ userId: req.params.id }, { _id: req.params.id }] });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = 'Banned';
    user.bannedReason = reason;
    user.bannedAt = new Date();
    await user.save();

    return res.json({ success: true, message: 'User banned successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unban user
// @route   POST /api/v1/admin/users/:id/unban
// @access  Private (Admin)
const unbanUser = async (req, res) => {
  try {
    const user = await User.findOne({ $or: [{ userId: req.params.id }, { _id: req.params.id }] });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = 'Active';
    user.bannedReason = null;
    user.bannedAt = null;
    await user.save();

    return res.json({ success: true, message: 'User account restored to Active' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify user account
// @route   POST /api/v1/admin/users/:id/verify
// @access  Private (Admin)
const verifyUser = async (req, res) => {
  try {
    const user = await User.findOne({ $or: [{ userId: req.params.id }, { _id: req.params.id }] });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    return res.json({ success: true, message: 'User verified successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle subscriber status
// @route   POST /api/v1/admin/users/:id/toggle-subscriber
// @access  Private (Admin)
const toggleSubscriber = async (req, res) => {
  try {
    const user = await User.findOne({ $or: [{ userId: req.params.id }, { _id: req.params.id }] });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isSubscribed = !user.isSubscribed;
    user.subscriptionExpiry = user.isSubscribed
      ? new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      : null;

    await user.save();

    return res.json({ success: true, message: 'User subscriber status updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  banUser,
  unbanUser,
  verifyUser,
  toggleSubscriber,
};
