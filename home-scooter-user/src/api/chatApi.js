import axiosClient from './axiosClient';

export const chatApi = {
  // Get all active chats for user
  getChats: async (userId) => {
    try {
      const res = await axiosClient.get('/v1/user/chats', { params: { userId } });
      return res;
    } catch (err) {
      return { success: true, chats: [] };
    }
  },

  // Start or fetch chat for an ad
  startChat: async (payload) => {
    try {
      const res = await axiosClient.post('/v1/user/chats/start', payload);
      return res;
    } catch (err) {
      return { success: false, message: 'Failed to start chat' };
    }
  },

  // Get messages for a chat conversation
  getChatMessages: async (chatId) => {
    try {
      const res = await axiosClient.get(`/v1/user/chats/${chatId}/messages`);
      return res;
    } catch (err) {
      return { success: false, messages: [] };
    }
  },

  // Send a new message
  sendMessage: async (chatId, payload) => {
    try {
      const res = await axiosClient.post(`/v1/user/chats/${chatId}/messages`, payload);
      return res;
    } catch (err) {
      return { success: false, message: 'Failed to send message' };
    }
  },
};
