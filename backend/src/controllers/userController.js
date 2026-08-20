const mongoose = require('mongoose');
const User = require('../models/User');

const findUserByIdentifier = async (id) => {
  if (!id) return null;
  const cleanId = String(id).trim();
  const query = [{ userId: cleanId }, { email: cleanId }, { phone: cleanId }];
  if (mongoose.Types.ObjectId.isValid(cleanId)) {
    query.push({ _id: cleanId });
  }
  return await User.findOne({ $or: query });
};

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
    const Advertisement = require('../models/Advertisement');

    const formatted = await Promise.all(
      users.map(async (u) => {
        const obj = u.toObject();

        const posterOrArray = [];
        if (obj.userId) posterOrArray.push({ posterId: String(obj.userId) });
        if (obj.phone) posterOrArray.push({ posterPhone: String(obj.phone) });
        if (obj.email) posterOrArray.push({ posterEmail: String(obj.email) });
        if (obj._id) posterOrArray.push({ posterId: String(obj._id) });

        const adsCount = posterOrArray.length > 0
          ? await Advertisement.countDocuments({ $or: posterOrArray })
          : 0;

        return {
          ...obj,
          id: obj.userId || String(obj._id),
          avatar: obj.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          postedAdsCount: adsCount || obj.postedAdsCount || 0,
        };
      })
    );

    return res.json({ success: true, data: formatted, total: formatted.length });
  } catch (error) {
    console.error('SERVER ERROR IN GETUSERS:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/v1/admin/users/:id
// @access  Private (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await findUserByIdentifier(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const obj = user.toObject();
    const Advertisement = require('../models/Advertisement');

    const posterOrArray = [];
    if (obj.userId) posterOrArray.push({ posterId: String(obj.userId) });
    if (obj.phone) posterOrArray.push({ posterPhone: String(obj.phone) });
    if (obj.email) posterOrArray.push({ posterEmail: String(obj.email) });
    if (obj._id) posterOrArray.push({ posterId: String(obj._id) });

    const userQuery = posterOrArray.length > 0 ? { $or: posterOrArray } : { posterId: 'NONE' };

    const postedAdsCount = await Advertisement.countDocuments(userQuery);
    const approvedAdsCount = await Advertisement.countDocuments({ ...userQuery, status: 'APPROVED' });
    const rejectedAdsCount = await Advertisement.countDocuments({ ...userQuery, status: 'REJECTED' });

    return res.json({
      success: true,
      ...obj,
      id: obj.userId || String(obj._id),
      avatar: obj.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      postedAdsCount: postedAdsCount || obj.postedAdsCount || 0,
      approvedAdsCount,
      rejectedAdsCount,
    });
  } catch (error) {
    console.error('SERVER ERROR IN GETUSERBYID:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ban user & unpublish their active advertisements
// @route   POST /api/v1/admin/users/:id/ban
// @access  Private (Admin)
const banUser = async (req, res) => {
  try {
    const { reason = 'Manual admin safety ban' } = req.body;
    const user = await findUserByIdentifier(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = 'Banned';
    user.bannedReason = reason;
    user.bannedAt = new Date();
    await user.save();

    // Dynamically unpublish all advertisements posted by this banned user in MongoDB
    const Advertisement = require('../models/Advertisement');
    const userQuery = {
      $or: [
        { posterId: user.userId },
        { posterPhone: user.phone },
        { posterEmail: user.email },
        { posterId: String(user._id) },
      ],
    };
    await Advertisement.updateMany(userQuery, { $set: { status: 'UNPUBLISHED', rejectionReason: 'User Account Banned' } });

    const { sendNotification } = require('../utils/createNotification');
    await sendNotification({
      recipientType: 'USER',
      userId: user.userId,
      title: 'Account Suspended 🚫',
      desc: `Your account has been suspended by Admin. Reason: ${reason}`,
      type: 'status',
      path: '/profile',
    });

    return res.json({
      success: true,
      message: `User ${user.name} banned successfully and all their active listings have been unpublished.`,
      user: { ...user.toObject(), id: user.userId },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unban user & restore their advertisements
// @route   POST /api/v1/admin/users/:id/unban
// @access  Private (Admin)
const unbanUser = async (req, res) => {
  try {
    const user = await findUserByIdentifier(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = 'Active';
    user.bannedReason = null;
    user.bannedAt = null;
    await user.save();

    // Restore user advertisements back to APPROVED in MongoDB
    const Advertisement = require('../models/Advertisement');
    const userQuery = {
      $or: [
        { posterId: user.userId },
        { posterPhone: user.phone },
        { posterEmail: user.email },
        { posterId: String(user._id) },
      ],
      status: 'UNPUBLISHED',
    };
    await Advertisement.updateMany(userQuery, { $set: { status: 'APPROVED', rejectionReason: null } });

    const { sendNotification } = require('../utils/createNotification');
    await sendNotification({
      recipientType: 'USER',
      userId: user.userId,
      title: 'Account Restored ✅',
      desc: `Your account has been unbanned and restored to Active status.`,
      type: 'status',
      path: '/profile',
    });

    return res.json({
      success: true,
      message: `User ${user.name} unbanned successfully and their listings have been restored to Active.`,
      user: { ...user.toObject(), id: user.userId },
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Verify user account
// @route   POST /api/v1/admin/users/:id/verify
// @access  Private (Admin)
const verifyUser = async (req, res) => {
  try {
    const user = await findUserByIdentifier(req.params.id);
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
    const user = await findUserByIdentifier(req.params.id);
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

