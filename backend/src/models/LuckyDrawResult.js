const mongoose = require('mongoose');

const RESULT_STATUS = {
  GENERATED: 'GENERATED',
  VERIFIED: 'VERIFIED',
  PUBLISHED: 'PUBLISHED',
  CANCELLED: 'CANCELLED',
};

const luckyDrawResultSchema = new mongoose.Schema(
  {
    luckyDrawId: { type: mongoose.Schema.Types.ObjectId, ref: 'LuckyDraw', required: true, index: true },
    totalEligibleEntries: { type: Number, required: true },
    eligibleEntrySnapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
    winners: [
      {
        ticketNumber: { type: String, required: true },
        userId: { type: String, required: true },
        userName: { type: String, default: '' },
        userPhone: { type: String, default: '' },
        prizeId: { type: mongoose.Schema.Types.ObjectId, ref: 'LuckyDrawPrize' },
        prizeTitle: { type: String, default: '' },
        selectedAt: { type: Date, default: Date.now },
      },
    ],
    randomProvider: { type: String, default: 'NODE_CRYPTO_CSRNG' },
    randomReference: { type: String, required: true },
    verificationHash: { type: String, required: true },
    executedAt: { type: Date, default: Date.now },
    executedBy: { type: String, default: 'SYSTEM' },
    status: {
      type: String,
      enum: Object.values(RESULT_STATUS),
      default: RESULT_STATUS.GENERATED,
      index: true,
    },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

luckyDrawResultSchema.statics.RESULT_STATUS = RESULT_STATUS;

module.exports = mongoose.model('LuckyDrawResult', luckyDrawResultSchema);
