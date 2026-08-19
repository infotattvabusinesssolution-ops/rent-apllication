const mongoose = require('mongoose');
const { LEAD_STATUS } = require('../config/constants');

const leadSchema = new mongoose.Schema(
  {
    leadId: { type: String, required: true, unique: true }, // e.g. LEAD-501
    adId: { type: String, required: true },
    adTitle: { type: String, required: true },
    posterName: { type: String, required: true },
    posterPhone: { type: String, required: true },
    buyerName: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    location: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: Object.values(LEAD_STATUS),
      default: LEAD_STATUS.NEW,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
