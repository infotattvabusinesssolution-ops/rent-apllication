const Notification = require('../models/Notification');

const sendNotification = async ({ recipientType = 'ADMIN', userId = null, title, desc, type = 'ad', path = '/ads/pending' }) => {
  try {
    const notificationId = `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    return await Notification.create({
      notificationId,
      recipientType,
      userId: userId ? String(userId) : null,
      title,
      desc,
      type,
      path,
      unread: true,
    });
  } catch (err) {
    console.error('Notification creation error:', err.message);
    return null;
  }
};

module.exports = { sendNotification };
