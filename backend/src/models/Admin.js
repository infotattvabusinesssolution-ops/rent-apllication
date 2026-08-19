const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    adminId: { type: String, required: true, unique: true }, // e.g. ADM-901
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'MODERATOR', 'SUPPORT'],
      default: 'SUPER_ADMIN',
    },
    avatar: { type: String, default: '' },
    lastLogin: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
