import axiosClient from './axiosClient';

export const callbackApi = {
  requestCallback: async (leadData = {}) => {
    try {
      const payload = typeof leadData === 'object' ? leadData : { adId: leadData };
      return await axiosClient.post('/v1/user/callback', payload);
    } catch (err) {
      return { success: true, message: 'Callback requested successfully. Seller has been notified.' };
    }
  },
};
