const express = require('express');
const router = express.Router();
const {
  getAdminNotifications,
  markAdminNotificationsRead,
  getUserNotifications,
  markUserNotificationsRead,
} = require('../../../controllers/notificationController');

// Admin routes
router.get('/admin/notifications', getAdminNotifications);
router.put('/admin/notifications/mark-read', markAdminNotificationsRead);

// User routes
router.get('/user/notifications', getUserNotifications);
router.put('/user/notifications/mark-read', markUserNotificationsRead);

module.exports = router;
