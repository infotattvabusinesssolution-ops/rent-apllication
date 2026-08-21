const mongoose = require('mongoose');

const PRIZE_TYPES = {
  CASH: 'CASH',
  PRODUCT: 'PRODUCT',
  VOUCHER: 'VOUCHER',
  SCOOTER: 'SCOOTER',
  ACCESSORY: 'ACCESSORY',
  OTHER: 'OTHER',
};

const luckyDrawPrizeSchema = new mongoose.Schema(
  {
    luckyDrawId: { type: mongoose.Schema.Types.ObjectId, ref: 'LuckyDraw', required: true, index: true },
    rank: { type: Number, required: true, default: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    prizeType: { type: String, enum: Object.values(PRIZE_TYPES), default: PRIZE_TYPES.CASH },
    prizeValue: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true, default: 1 },
    winnersRequired: { type: Number, required: true, default: 1 },
    status: { type: String, default: 'ACTIVE' },
  },
  { timestamps: true }
);

luckyDrawPrizeSchema.statics.PRIZE_TYPES = PRIZE_TYPES;

module.exports = mongoose.model('LuckyDrawPrize', luckyDrawPrizeSchema);
