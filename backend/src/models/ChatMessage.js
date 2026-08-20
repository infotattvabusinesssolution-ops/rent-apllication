const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    messageId: { type: String, required: true, unique: true, index: true },
    chatId: { type: String, required: true, index: true },
    senderId: { type: String, required: true, index: true },
    senderName: { type: String, required: true },
    receiverId: { type: String, required: true, index: true },
    text: { type: String, required: true },
    attachments: [{ type: String }],
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
