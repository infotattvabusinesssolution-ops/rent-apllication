const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // e.g. USR-8821
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isSubscribed: { type: Boolean, default: false },
    subscriptionExpiry: { type: Date, default: null },
    status: { type: String, enum: ['Active', 'Banned', 'Inactive'], default: 'Active' },
    bannedReason: { type: String, default: null },
    bannedAt: { type: Date, default: null },
    postedAdsCount: { type: Number, default: 0 },
    approvedAdsCount: { type: Number, default: 0 },
    rejectedAdsCount: { type: Number, default: 0 },
    reportsCount: { type: Number, default: 0 },
    joinedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
