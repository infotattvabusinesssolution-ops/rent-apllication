const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema(
  {
    autoApproveVerified: { type: Boolean, default: false },
    mandatoryImages: { type: Boolean, default: true },
    subscriptionPrice: { type: Number, default: 100 },
    subscriptionDays: { type: Number, default: 10 },
    whatsAppDispatchEnabled: { type: Boolean, default: true },
    emailNotificationsEnabled: { type: Boolean, default: true },
    dealerName: { type: String, default: 'Hoskote Realties' },
    dealerPhone: { type: String, default: '+91 98765 43210' },
    dealerWhatsapp: { type: String, default: '+91 98765 43210' },
    paymentQrCodeUrl: { type: String, default: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=rentapp@upi%26pn=Home%20And%20Scooter%26am=100' },
    upiId: { type: String, default: 'rentapp@upi' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
