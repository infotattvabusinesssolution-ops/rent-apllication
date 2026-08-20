const Notification = require('../models/Notification');

// @desc    Get admin real-time notifications
// @route   GET /api/v1/admin/notifications
const getAdminNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({ recipientType: 'ADMIN' })
      .sort({ createdAt: -1 })
      .limit(20);

    // Seed default notifications if empty so UI looks beautiful initially
    if (notifications.length === 0) {
      await Notification.create([
        {
          notificationId: `NOTIF-INIT-1`,
          recipientType: 'ADMIN',
          title: 'New Ad Pending Review',
          desc: '30x40 Hoskote Corner Plot submitted for moderation',
          type: 'ad',
          path: '/ads/pending',
          unread: true,
        },
        {
          notificationId: `NOTIF-INIT-2`,
          recipientType: 'ADMIN',
          title: '₹100 Subscription Payment',
          desc: 'New user uploaded payment screenshot for subscription',
          type: 'payment',
          path: '/subscriptions',
          unread: true,
        },
        {
          notificationId: `NOTIF-INIT-3`,
          recipientType: 'ADMIN',
          title: 'New Callback Lead',
          desc: 'Callback lead received for Hoskote Realties listing',
          type: 'lead',
          path: '/leads',
          unread: false,
        },
      ]);
      notifications = await Notification.find({ recipientType: 'ADMIN' }).sort({ createdAt: -1 });
    }

    const formatted = notifications.map((n) => ({
      id: n.notificationId || String(n._id),
      title: n.title,
      desc: n.desc,
      time: formatTimeAgo(n.createdAt),
      type: n.type,
      path: n.path,
      unread: n.unread,
    }));

    return res.json({ success: true, notifications: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark admin notifications as read
// @route   PUT /api/v1/admin/notifications/mark-read
const markAdminNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipientType: 'ADMIN', unread: true }, { $set: { unread: false } });
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user real-time notifications
// @route   GET /api/v1/user/notifications
const getUserNotifications = async (req, res) => {
  try {
    const rawUserId = req.query.userId || req.user?.userId || req.user?.id || 'USR-3894';

    let notifications = await Notification.find({
      recipientType: 'USER',
      $or: [{ userId: String(rawUserId) }, { userId: null }],
    })
      .sort({ createdAt: -1 })
      .limit(30);

    if (notifications.length === 0) {
      await Notification.create([
        {
          notificationId: `NOTIF-UINIT-1`,
          recipientType: 'USER',
          userId: String(rawUserId),
          title: 'Welcome to Home & Scooter! 🎉',
          desc: 'Explore Hoskote plots, houses, electric scooters and local services near you.',
          type: 'system',
          path: '/',
          unread: true,
        },
        {
          notificationId: `NOTIF-UINIT-2`,
          recipientType: 'USER',
          userId: String(rawUserId),
          title: 'Ad Submission Tip 💡',
          desc: 'Clear photos and detailed descriptions receive 3x more buyer callbacks!',
          type: 'ad',
          path: '/post-ad',
          unread: false,
        },
      ]);
      notifications = await Notification.find({
        recipientType: 'USER',
        $or: [{ userId: String(rawUserId) }, { userId: null }],
      }).sort({ createdAt: -1 });
    }

    const formatted = notifications.map((n) => ({
      id: n.notificationId || String(n._id),
      title: n.title,
      desc: n.desc,
      time: formatTimeAgo(n.createdAt),
      type: n.type,
      path: n.path,
      unread: n.unread,
    }));

    return res.json({ success: true, notifications: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark user notifications as read
// @route   PUT /api/v1/user/notifications/mark-read
const markUserNotificationsRead = async (req, res) => {
  try {
    const rawUserId = req.query.userId || req.user?.userId || req.user?.id || 'USR-3894';
    await Notification.updateMany(
      { recipientType: 'USER', $or: [{ userId: String(rawUserId) }, { userId: null }], unread: true },
      { $set: { unread: false } }
    );
    return res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const formatTimeAgo = (date) => {
  if (!date) return 'Just now';
  const diffSec = Math.floor((new Date() - new Date(date)) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
};

module.exports = {
  getAdminNotifications,
  markAdminNotificationsRead,
  getUserNotifications,
  markUserNotificationsRead,
};
