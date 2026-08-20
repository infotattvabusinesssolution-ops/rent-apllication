const express = require('express');
const router = express.Router();
const {
  chatEventsStream,
  getUserChats,
  startChat,
  getChatMessages,
  sendMessage,
} = require('../../../../controllers/user/chatController');

router.get('/events', chatEventsStream);
router.get('/', getUserChats);
router.post('/start', startChat);
router.get('/:chatId/messages', getChatMessages);
router.post('/:chatId/messages', sendMessage);

module.exports = router;
