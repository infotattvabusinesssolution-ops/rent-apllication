const mongoose = require('mongoose');
const { SUBSCRIPTION_STATUS } = require('../config/constants');

const subscriptionSchema = new mongoose.Schema(
  {
    subId: { type: String, required: true, unique: true }, // e.g. SUB-9821
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
    userEmail: { type: String, default: '' },
    amount: { type: Number, default: 100 },
    currency: { type: String, default: '₹' },
    upiReference: { type: String, required: true, trim: true },
    screenshotUrl: { type: String, required: true },
    notes: { type: String, default: '' },
    submittedDate: { type: Date, default: Date.now },

    // Verification Credentials
    status: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.PENDING,
      index: true,
    },
    activatedDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null },
    generatedUsername: { type: String, default: null },
    generatedPassword: { type: String, default: null },
    whatsAppSent: { type: Boolean, default: false },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
