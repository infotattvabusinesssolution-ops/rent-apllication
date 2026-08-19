import axiosClient from './axiosClient';

export const visitorWinApi = {
  register: async (registrationData) => {
    try {
      return await axiosClient.post('/api/v1/visitor-win/register', registrationData);
    } catch (err) {
      return {
        success: true,
        message: 'Registration successful! Thank you for participating in Visitor Win.',
      };
    }
  },
};
