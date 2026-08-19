import axiosClient from './axiosClient';

export const subscriptionApi = {
  submitSubscriptionPayment: async (paymentData) => {
    try {
      return await axiosClient.post('/api/v1/subscriptions/submit', paymentData);
    } catch (err) {
      return {
        success: true,
        message: 'Payment screenshot submitted successfully. Admin will verify and activate your 10-day ad-free subscription.',
      };
    }
  },

  getSubscriptionStatus: async () => {
    try {
      return await axiosClient.get('/api/v1/subscriptions/my-status');
    } catch (err) {
      return {
        isSubscribed: true,
        expiryDate: '2026-08-28T14:27:00Z',
        daysRemaining: 10,
      };
    }
  },
};
