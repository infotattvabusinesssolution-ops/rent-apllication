const mongoose = require('mongoose');

const ENTRY_STATUS = {
  VALID: 'VALID',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  WINNER: 'WINNER',
  NOT_SELECTED: 'NOT_SELECTED',
};

const luckyDrawEntrySchema = new mongoose.Schema(
  {
    luckyDrawId: { type: mongoose.Schema.Types.ObjectId, ref: 'LuckyDraw', required: true, index: true },
    userId: { type: String, required: true, index: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'LuckyDrawOrder', required: true, index: true },
    ticketNumber: { type: String, required: true, unique: true, index: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(ENTRY_STATUS),
      default: ENTRY_STATUS.VALID,
      index: true,
    },
    isWinner: { type: Boolean, default: false, index: true },
    prizeId: { type: mongoose.Schema.Types.ObjectId, ref: 'LuckyDrawPrize', default: null },
    purchasedAt: { type: Date, default: Date.now },
    winnerSelectedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

luckyDrawEntrySchema.statics.ENTRY_STATUS = ENTRY_STATUS;

module.exports = mongoose.model('LuckyDrawEntry', luckyDrawEntrySchema);
