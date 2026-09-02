const mongoose = require('mongoose');

const premiumUpgradeRequestSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true, unique: true, index: true }, // e.g. PREM-REQ-5001
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
    userEmail: { type: String, default: '' },
    premiumMemberId: { type: String, default: null },
    plan: {
      type: String,
      enum: ['3 Days', '10 Days', '30 Days', '1 Month', '3 Months', '6 Months', '12 Months'],
      required: true,
    },
    amount: { type: Number, required: true },
    paymentReference: { type: String, required: true },
    paymentScreenshot: { type: String, default: '' },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    requestStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    rejectionReason: { type: String, default: null },
    approvedBy: { type: String, default: null },
    approvedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PremiumUpgradeRequest', premiumUpgradeRequestSchema);
