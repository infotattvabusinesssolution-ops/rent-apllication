const mongoose = require('mongoose');

const premiumContentSchema = new mongoose.Schema(
  {
    contentId: { type: String, required: true, unique: true, index: true }, // e.g. PREM-CNT-1001
    contentType: {
      type: String,
      enum: ['TEXT', 'BANNER', 'VIDEO'],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    mediaUrl: { type: String, default: '' }, // Image banner or video file URL
    thumbnailUrl: { type: String, default: '' }, // Video thumbnail URL
    displayOrder: { type: Number, default: 0 },
    startDate: { type: Date, default: null, index: true },
    endDate: { type: Date, default: null, index: true },
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'INACTIVE'],
      default: 'DRAFT',
      index: true,
    },
    premiumOnly: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PremiumContent', premiumContentSchema);
