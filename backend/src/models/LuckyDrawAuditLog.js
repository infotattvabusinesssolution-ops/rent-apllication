const mongoose = require('mongoose');

const luckyDrawAuditLogSchema = new mongoose.Schema(
  {
    luckyDrawId: { type: mongoose.Schema.Types.ObjectId, ref: 'LuckyDraw', default: null, index: true },
    action: { type: String, required: true, index: true },
    performedBy: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LuckyDrawAuditLog', luckyDrawAuditLogSchema);
