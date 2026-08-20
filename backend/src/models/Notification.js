const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true },
  recipientType: { type: String, enum: ['ADMIN', 'USER'], default: 'ADMIN' },
  userId: { type: String, default: null },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  type: { type: String, enum: ['ad', 'payment', 'report', 'lead', 'system', 'status'], default: 'ad' },
  path: { type: String, default: '/ads/pending' },
  unread: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
