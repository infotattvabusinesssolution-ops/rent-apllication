const Chat = require('../../models/Chat');
const ChatMessage = require('../../models/ChatMessage');
const Advertisement = require('../../models/Advertisement');
const User = require('../../models/User');

// In-memory active listeners for Real-time Socket Event broadcasting
const activeSocketListeners = new Set();

const broadcastSocketEvent = (event, data) => {
  const payload = `data: ${JSON.stringify({ event, data })}\n\n`;
  for (const clientRes of activeSocketListeners) {
    try {
      clientRes.write(payload);
    } catch (e) {
      activeSocketListeners.delete(clientRes);
    }
  }
};

// @desc    Real-time Socket Event Stream Connection
// @route   GET /api/v1/user/chats/events
// @access  Public / Token Protected
const chatEventsStream = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.write(`data: ${JSON.stringify({ event: 'connected', message: 'Real-time chat socket stream connected' })}\n\n`);

  activeSocketListeners.add(res);

  req.on('close', () => {
    activeSocketListeners.delete(res);
  });
};

// @desc    Get all chats for active user (Buyer or Seller)
// @route   GET /api/v1/user/chats
// @access  Public / Token Protected
const getUserChats = async (req, res) => {
  try {
    const userId = req.query.userId || req.user?.id || req.user?.userId || 'USR-8821';
    const chats = await Chat.find({
      $or: [{ buyerId: userId }, { sellerId: userId }],
    }).sort({ lastMessageAt: -1 });

    const formatted = chats.map((c) => {
      const obj = c.toObject();
      const isBuyer = obj.buyerId === userId;
      return {
        ...obj,
        id: obj.chatId,
        otherPartyName: isBuyer ? obj.sellerName : obj.buyerName,
        otherPartyAvatar: isBuyer ? obj.sellerAvatar : obj.buyerAvatar,
        otherPartyPhone: isBuyer ? obj.sellerPhone : obj.buyerPhone,
        unreadCount: isBuyer ? obj.unreadCountBuyer : obj.unreadCountSeller,
      };
    });

    return res.json({ success: true, chats: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Start or retrieve existing 1-to-1 Chat for an Ad
// @route   POST /api/v1/user/chats/start
// @access  Public / Token Protected
const startChat = async (req, res) => {
  try {
    const { adId, buyerId, buyerName, buyerPhone, buyerAvatar } = req.body;
    if (!adId) {
      return res.status(400).json({ success: false, message: 'Ad ID is required to start chat' });
    }

    const ad = await Advertisement.findOne({ $or: [{ adId }, { _id: adId }] });
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    const currentBuyerId = buyerId || req.user?.id || req.user?.userId || 'USR-8821';
    const currentBuyerName = buyerName || req.user?.name || 'Buyer';
    const currentBuyerPhone = buyerPhone || req.user?.phone || '';
    const currentBuyerAvatar = buyerAvatar || req.user?.avatar || '';

    const currentSellerId = ad.posterId || 'USR-8822';
    const currentSellerName = ad.posterName || 'Verified Seller';
    const currentSellerPhone = ad.posterPhone || '';

    // Check if chat already exists between this buyer and seller for this ad
    let chat = await Chat.findOne({
      adId: ad.adId || adId,
      buyerId: currentBuyerId,
      sellerId: currentSellerId,
    });

    if (!chat) {
      const chatId = `CHAT-${Math.floor(10000 + Math.random() * 90000)}`;
      chat = await Chat.create({
        chatId,
        adId: ad.adId || adId,
        adTitle: ad.title || 'Marketplace Item',
        adImage: ad.imageUrls?.[0] || '',
        buyerId: currentBuyerId,
        buyerName: currentBuyerName,
        buyerPhone: currentBuyerPhone,
        buyerAvatar: currentBuyerAvatar,
        sellerId: currentSellerId,
        sellerName: currentSellerName,
        sellerPhone: currentSellerPhone,
        lastMessage: `Hi! Is "${ad.title}" still available?`,
        lastMessageAt: new Date(),
        unreadCountSeller: 1,
      });

      // Create initial message
      const firstMsgId = `MSG-${Math.floor(10000 + Math.random() * 90000)}`;
      await ChatMessage.create({
        messageId: firstMsgId,
        chatId,
        senderId: currentBuyerId,
        senderName: currentBuyerName,
        receiverId: currentSellerId,
        text: `Hi! Is "${ad.title}" still available?`,
      });

      broadcastSocketEvent('chat:created', { chat });
    }

    const obj = chat.toObject();
    return res.status(201).json({
      success: true,
      chat: { ...obj, id: obj.chatId },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all messages for a specific chat
// @route   GET /api/v1/user/chats/:chatId/messages
// @access  Public / Token Protected
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat conversation not found' });
    }

    const messages = await ChatMessage.find({ chatId }).sort({ createdAt: 1 });

    const obj = chat.toObject();
    return res.json({
      success: true,
      chat: { ...obj, id: obj.chatId },
      messages: messages.map((m) => {
        const msgObj = m.toObject();
        return { ...msgObj, id: msgObj.messageId };
      }),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a new message in a 1-to-1 Chat (Real-time Socket Event Triggered)
// @route   POST /api/v1/user/chats/:chatId/messages
// @access  Public / Token Protected
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text, senderId, senderName, receiverId } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty' });
    }

    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat conversation not found' });
    }

    const currentSenderId = senderId || req.user?.id || req.user?.userId || chat.buyerId;
    const currentSenderName = senderName || req.user?.name || (currentSenderId === chat.buyerId ? chat.buyerName : chat.sellerName);
    const currentReceiverId = receiverId || (currentSenderId === chat.buyerId ? chat.sellerId : chat.buyerId);

    const messageId = `MSG-${Math.floor(10000 + Math.random() * 90000)}`;

    const newMessage = await ChatMessage.create({
      messageId,
      chatId,
      senderId: currentSenderId,
      senderName: currentSenderName,
      receiverId: currentReceiverId,
      text: text.trim(),
      createdAt: new Date(),
    });

    // Update Chat last message timestamp and unread counters
    chat.lastMessage = text.trim();
    chat.lastMessageAt = new Date();
    if (currentSenderId === chat.buyerId) {
      chat.unreadCountSeller += 1;
    } else {
      chat.unreadCountBuyer += 1;
    }
    await chat.save();

    const msgObj = newMessage.toObject();
    const formattedMsg = { ...msgObj, id: msgObj.messageId };

    // Broadcast Real-time Socket Event
    broadcastSocketEvent('chat:new-message', {
      chatId,
      message: formattedMsg,
      chat: { ...chat.toObject(), id: chat.chatId },
    });

    return res.status(201).json({
      success: true,
      message: formattedMsg,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  chatEventsStream,
  getUserChats,
  startChat,
  getChatMessages,
  sendMessage,
};
