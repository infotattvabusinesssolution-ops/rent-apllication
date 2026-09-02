const mongoose = require('mongoose');

const premiumPlanSchema = new mongoose.Schema(
  {
    planId: { type: String, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: String, required: true, trim: true }, // e.g. "3 Days", "10 Days", "30 Days"
    durationInDays: { type: Number, required: true, min: 1 },
    popular: { type: Boolean, default: false },
    description: { type: String, default: '', trim: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PremiumPlan', premiumPlanSchema);
