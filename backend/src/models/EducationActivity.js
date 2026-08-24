const mongoose = require('mongoose');

const educationActivitySchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      index: true,
    },
    contentId: {
      type: String,
      default: null,
      index: true,
    },
    notificationId: {
      type: String,
      default: null,
    },
    activityType: {
      type: String,
      enum: [
        'LOGIN',
        'LOGOUT',
        'CONTENT_VIEW',
        'VIDEO_VIEW',
        'BANNER_VIEW',
        'DOCUMENT_VIEW',
        'LINK_CLICK',
        'NOTIFICATION_OPEN',
      ],
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model('EducationActivity', educationActivitySchema);
