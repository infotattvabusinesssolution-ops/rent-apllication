const mongoose = require('mongoose');

const premiumMemberSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: 'User', index: true },
    userName: { type: String, required: true, trim: true },
    userPhone: { type: String, required: true, index: true },
    userEmail: { type: String, default: '', lowercase: true, trim: true },
    premiumMemberId: { type: String, required: true, unique: true, index: true }, // e.g. PREM-2026-00001
    passwordHash: { type: String, required: true },
    plan: { 
      type: String, 
      enum: ['3 Days', '10 Days', '30 Days', '1 Month', '3 Months', '6 Months', '12 Months'], 
      required: true 
    },
    startDate: { type: Date, required: true, default: Date.now },
    expiryDate: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'EXPIRED', 'BLOCKED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    lastLogin: { type: Date, default: null },
    blockedReason: { type: String, default: null },
    blockedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PremiumMember', premiumMemberSchema);
