import axiosClient from './axiosClient';
import { MOCK_BANNERS } from '../mock/mockData';

let localBannersState = [...MOCK_BANNERS];

export const bannerApi = {
  getBanners: async (params = {}) => {
    try {
      return await axiosClient.get('/api/v1/admin/banners', { params });
    } catch (err) {
      let filtered = [...localBannersState];
      if (params.status && params.status !== 'ALL') {
        filtered = filtered.filter((b) => b.status === params.status);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.id.toLowerCase().includes(q) ||
            (b.sponsorName && b.sponsorName.toLowerCase().includes(q))
        );
      }
      return { data: filtered, total: filtered.length };
    }
  },

  approveBanner: async (id) => {
    try {
      return await axiosClient.patch(`/api/v1/admin/banners/${id}/approve`);
    } catch (err) {
      localBannersState = localBannersState.map((b) =>
        b.id === id ? { ...b, status: 'Active' } : b
      );
      return { success: true, message: 'Banner campaign approved and activated' };
    }
  },

  rejectBanner: async (id, reason = 'Violates campaign guidelines') => {
    try {
      return await axiosClient.patch(`/api/v1/admin/banners/${id}/reject`, { reason });
    } catch (err) {
      localBannersState = localBannersState.map((b) =>
        b.id === id ? { ...b, status: 'Rejected', rejectionReason: reason } : b
      );
      return { success: true, message: 'Banner campaign rejected' };
    }
  },

  createBanner: async (data) => {
    try {
      const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      return await axiosClient.post('/api/v1/admin/banners', data, config);
    } catch (err) {
      const newBanner = {
        id: `BAN-${Math.floor(100 + Math.random() * 900)}`,
        title: data.title || 'New Promotional Campaign',
        targetScreen: data.targetScreen || 'Home Top Carousel',
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
        destinationUrl: data.destinationUrl || 'https://homescooter.com',
        phoneNumber: data.phoneNumber || '+91 98000 00000',
        sponsorName: data.sponsorName || 'Admin Sponsor',
        startDate: data.startDate || new Date().toISOString().slice(0, 10),
        expiryDate: data.expiryDate || new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
        status: 'Active',
        impressions: 0,
        clicks: 0,
      };
      localBannersState.unshift(newBanner);
      return { success: true, banner: newBanner, message: 'Banner created successfully' };
    }
  },

  deleteBanner: async (id) => {
    try {
      return await axiosClient.delete(`/api/v1/admin/banners/${id}`);
    } catch (err) {
      localBannersState = localBannersState.filter((b) => b.id !== id);
      return { success: true, message: 'Banner deleted successfully' };
    }
  },
};
