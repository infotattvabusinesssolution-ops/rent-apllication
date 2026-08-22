import axiosClient from './axiosClient';

export const luckyDrawUserApi = {
  getDraws: async (params = {}) => {
    return await axiosClient.get('/v1/user/lucky-draws', { params });
  },

  getDrawById: async (id) => {
    return await axiosClient.get(`/v1/user/lucky-draws/${id}`);
  },

  createOrder: async (drawId, quantity) => {
    return await axiosClient.post(`/v1/user/lucky-draws/${drawId}/orders`, { quantity });
  },

  verifyPayment: async (data) => {
    return await axiosClient.post('/v1/user/lucky-draws/verify-payment', data);
  },

  getMyEntries: async () => {
    return await axiosClient.get('/v1/user/lucky-draws/user/my-entries');
  },

  submitEnquiry: async (enquiryData) => {
    return await axiosClient.post('/v1/user/lucky-draws/enquiries', enquiryData);
  },
};
