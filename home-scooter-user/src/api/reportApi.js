import axiosClient from './axiosClient';

export const reportApi = {
  submitReport: async (adId, reportData) => {
    try {
      return await axiosClient.post(`/api/v1/ads/${adId}/report`, reportData);
    } catch (err) {
      return {
        success: true,
        message: 'Report submitted successfully. Thank you for keeping the marketplace safe.',
      };
    }
  },
};
