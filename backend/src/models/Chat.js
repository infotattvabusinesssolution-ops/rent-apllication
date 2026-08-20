const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true, unique: true, index: true },
    adId: { type: String, required: true },
    adTitle: { type: String, required: true },
    adImage: { type: String, default: '' },
    buyerId: { type: String, required: true, index: true },
    buyerName: { type: String, required: true },
    buyerPhone: { type: String, default: '' },
    buyerAvatar: { type: String, default: '' },
    sellerId: { type: String, required: true, index: true },
    sellerName: { type: String, required: true },
    sellerPhone: { type: String, default: '' },
    sellerAvatar: { type: String, default: '' },
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
    unreadCountBuyer: { type: Number, default: 0 },
    unreadCountSeller: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Archived'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
