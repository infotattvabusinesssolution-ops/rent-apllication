const mongoose = require('mongoose');
const { REPORT_STATUS } = require('../config/constants');

const reportSchema = new mongoose.Schema(
  {
    reportId: { type: String, required: true, unique: true }, // e.g. REP-301
    adId: { type: String, required: true },
    adTitle: { type: String, required: true },
    sellerName: { type: String, required: true },
    sellerPhone: { type: String, required: true },
    reporterName: { type: String, required: true },
    reporterPhone: { type: String, required: true },
    reportReason: { type: String, required: true },
    comment: { type: String, default: '' },
    reportedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: Object.values(REPORT_STATUS),
      default: REPORT_STATUS.PENDING,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
