import axiosClient from './axiosClient';

export const bannerApi = {
  getBanners: async (params = {}) => {
    return await axiosClient.get('/api/v1/admin/banners', { params });
  },

  approveBanner: async (id) => {
    return await axiosClient.patch(`/api/v1/admin/banners/${id}/approve`);
  },

  rejectBanner: async (id, reason = 'Violates campaign guidelines') => {
    return await axiosClient.patch(`/api/v1/admin/banners/${id}/reject`, { reason });
  },

  createBanner: async (data) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return await axiosClient.post('/api/v1/admin/banners', data, config);
  },

  deleteBanner: async (id) => {
    return await axiosClient.delete(`/api/v1/admin/banners/${id}`);
  },
};
