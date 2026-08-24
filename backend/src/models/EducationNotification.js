const mongoose = require('mongoose');

const educationNotificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
    },
    notificationType: {
      type: String,
      enum: ['GENERAL', 'COURSE', 'CAREER', 'EXAM', 'SCHOLARSHIP', 'ADMISSION', 'ANNOUNCEMENT'],
      default: 'GENERAL',
    },
    targetAudience: {
      type: String,
      default: 'ALL',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    contentId: {
      type: String,
      default: null,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SCHEDULED', 'SENT', 'CANCELLED'],
      default: 'DRAFT',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('EducationNotification', educationNotificationSchema);
