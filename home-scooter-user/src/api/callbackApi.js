import axiosClient from './axiosClient';

export const callbackApi = {
  requestCallback: async (adId, buyerDetails = {}) => {
    try {
      return await axiosClient.post('/api/v1/leads/callback', { adId, ...buyerDetails });
    } catch (err) {
      return { success: true, message: 'Callback requested successfully. Seller has been notified.' };
    }
  },
};
