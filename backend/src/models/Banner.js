const mongoose = require('mongoose');
const { BANNER_STATUS, BANNER_LOCATIONS } = require('../config/constants');

const bannerSchema = new mongoose.Schema(
  {
    bannerId: { type: String, required: true, unique: true }, // e.g. BAN-100
    title: { type: String, required: true, trim: true },
    targetScreen: {
      type: String,
      enum: BANNER_LOCATIONS,
      required: true,
    },
    imageUrl: { type: String, required: true },
    destinationUrl: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    sponsorName: { type: String, required: true },
    startDate: { type: String, required: true },
    expiryDate: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(BANNER_STATUS),
      default: BANNER_STATUS.ACTIVE,
      index: true,
    },
    rejectionReason: { type: String, default: null },
    submittedAt: { type: Date, default: Date.now },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
