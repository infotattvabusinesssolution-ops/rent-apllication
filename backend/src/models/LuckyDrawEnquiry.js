const mongoose = require('mongoose');

const luckyDrawEnquirySchema = new mongoose.Schema(
  {
    enquiryId: { type: String, required: true, unique: true }, // e.g. LDE-1001
    adId: { type: String, required: true, index: true },
    adTitle: { type: String, required: true },
    adCategory: { type: String, default: 'General' },
    adImageUrl: { type: String, default: '' },
    visitorName: { type: String, required: true, trim: true },
    visitorPhone: { type: String, required: true, trim: true },
    visitorEmail: { type: String, default: '', trim: true },
    visitorDetails: { type: String, default: '' },
    whatsAppSent: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'COMPLETED'],
      default: 'NEW',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LuckyDrawEnquiry', luckyDrawEnquirySchema);
