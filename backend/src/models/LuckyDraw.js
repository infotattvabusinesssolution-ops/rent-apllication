const mongoose = require('mongoose');

const LUCKY_DRAW_STATUS = {
  DRAFT: 'DRAFT',
  UPCOMING: 'UPCOMING',
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  DRAWING: 'DRAWING',
  WINNER_SELECTED: 'WINNER_SELECTED',
  VERIFIED: 'VERIFIED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

const luckyDrawSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },

    bannerImage: { type: String, default: '' },
    thumbnailImage: { type: String, default: '' },

    entryPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },

    maxEntries: { type: Number, required: true, min: 1 },
    maxEntriesPerUser: { type: Number, default: 5, min: 1 },

    totalEntries: { type: Number, default: 0, min: 0 },

    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    drawDate: { type: Date, required: true, index: true },

    status: {
      type: String,
      enum: Object.values(LUCKY_DRAW_STATUS),
      default: LUCKY_DRAW_STATUS.DRAFT,
      index: true,
    },

    isPublished: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    showOnHomepage: { type: Boolean, default: true },

    rules: [{ type: String }],
    terms: [{ type: String }],

    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

luckyDrawSchema.statics.LUCKY_DRAW_STATUS = LUCKY_DRAW_STATUS;

module.exports = mongoose.model('LuckyDraw', luckyDrawSchema);
