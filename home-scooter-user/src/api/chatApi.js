import axiosClient from './axiosClient';
import { MOCK_CHATS } from '../mock/mockData';

let localChats = [...MOCK_CHATS];

export const chatApi = {
  getConversations: async () => {
    try {
      return await axiosClient.get('/api/v1/chats');
    } catch (err) {
      return { data: localChats, total: localChats.length };
    }
  },

  getChatMessages: async (chatId) => {
    try {
      return await axiosClient.get(`/api/v1/chats/${chatId}`);
    } catch (err) {
      const chat = localChats.find((c) => c.id === chatId);
      if (chat) return chat;
      return localChats[0];
    }
  },

  sendMessage: async (chatId, text) => {
    try {
      return await axiosClient.post(`/api/v1/chats/${chatId}/messages`, { text });
    } catch (err) {
      const newMsg = {
        id: `m-${Date.now()}`,
        sender: 'buyer',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      localChats = localChats.map((c) => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      });
      return { success: true, message: newMsg };
    }
  },
};
