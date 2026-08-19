const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema(
  {
    autoApproveVerified: { type: Boolean, default: false },
    mandatoryImages: { type: Boolean, default: true },
    subscriptionPrice: { type: Number, default: 100 },
    subscriptionDays: { type: Number, default: 10 },
    whatsAppDispatchEnabled: { type: Boolean, default: true },
    emailNotificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
