const mongoose = require('mongoose');

const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
};

const luckyDrawOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    luckyDrawId: { type: mongoose.Schema.Types.ObjectId, ref: 'LuckyDraw', required: true, index: true },
    quantity: { type: Number, required: true, min: 1 },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    paymentGateway: { type: String, default: 'RAZORPAY' },
    gatewayOrderId: { type: String, default: null, index: true },
    gatewayPaymentId: { type: String, default: null, index: true },
    paymentStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true,
    },
    status: { type: String, default: 'PENDING' },
    gatewayResponse: { type: mongoose.Schema.Types.Mixed, default: {} },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

luckyDrawOrderSchema.statics.ORDER_STATUS = ORDER_STATUS;

module.exports = mongoose.model('LuckyDrawOrder', luckyDrawOrderSchema);
