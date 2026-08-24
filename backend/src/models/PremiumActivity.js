const mongoose = require('mongoose');

const premiumActivitySchema = new mongoose.Schema(
  {
    memberId: { type: String, required: true, index: true },
    contentId: { type: String, default: null },
    activityType: {
      type: String,
      enum: ['LOGIN', 'LOGOUT', 'TEXT_VIEW', 'BANNER_VIEW', 'VIDEO_VIEW', 'CONTENT_VIEW'],
      required: true,
    },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PremiumActivity', premiumActivitySchema);
