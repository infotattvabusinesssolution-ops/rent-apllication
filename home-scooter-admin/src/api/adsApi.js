import axiosClient from './axiosClient';

export const adsApi = {
  getAds: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/ads', { params });
  },

  getPendingAds: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/ads/pending', { params });
  },

  getAdById: async (id) => {
    return await axiosClient.get(`/api/v1/admin/ads/${id}`);
  },

  approveAd: async (id) => {
    return await axiosClient.patch(`/api/v1/admin/ads/${id}/approve`);
  },

  rejectAd: async (id, reason, notes = '') => {
    return await axiosClient.patch(`/api/v1/admin/ads/${id}/reject`, { reason, notes });
  },

  updateBadges: async (id, badges) => {
    return await axiosClient.patch(`/api/v1/admin/ads/${id}/badges`, badges);
  },

  toggleLuckyDrawStatus: async (id, luckyDrawStatus, luckyDrawImage = null) => {
    return await axiosClient.patch(`/api/v1/admin/ads/${id}/lucky-draw`, { luckyDrawStatus, luckyDrawImage });
  },

  uploadLuckyDrawImage: async (id, fileOrBase64) => {
    if (typeof fileOrBase64 === 'string' && (fileOrBase64.startsWith('http') || fileOrBase64.startsWith('data:'))) {
      return await axiosClient.post(`/api/v1/admin/ads/${id}/lucky-draw-image`, { image: fileOrBase64 });
    }
    const formData = new FormData();
    formData.append('image', fileOrBase64);
    return await axiosClient.post(`/api/v1/admin/ads/${id}/lucky-draw-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  unpublishAd: async (id) => {
    return await axiosClient.patch(`/api/v1/admin/ads/${id}/unpublish`);
  },

  deleteAd: async (id) => {
    return await axiosClient.delete(`/api/v1/admin/ads/${id}`);
  },
};
