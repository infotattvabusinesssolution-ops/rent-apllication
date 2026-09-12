const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // e.g. USR-8821
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    avatar: { type: String, default: '' },
    location: { type: String, default: 'Bangalore, Karnataka' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
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
    resetOtp: { type: String, default: null },
    resetOtpExpires: { type: Date, default: null },
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
