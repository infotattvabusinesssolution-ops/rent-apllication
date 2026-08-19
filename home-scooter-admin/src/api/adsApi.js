import axiosClient from './axiosClient';
import { MOCK_ADS } from '../mock/mockData';

let localAdsState = [...MOCK_ADS];

export const adsApi = {
  getAds: async (params = {}) => {
    try {
      const response = await axiosClient.get('/api/v1/admin/ads', { params });
      return response;
    } catch (err) {
      let filtered = [...localAdsState];
      if (params.status && params.status !== 'ALL') {
        filtered = filtered.filter((ad) => ad.status === params.status);
      }
      if (params.category && params.category !== 'ALL') {
        filtered = filtered.filter((ad) => ad.category === params.category);
      }
      if (params.isFeatured) {
        filtered = filtered.filter((ad) => ad.isFeatured);
      }
      if (params.isHighDemand) {
        filtered = filtered.filter((ad) => ad.isHighDemand);
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (ad) =>
            ad.title.toLowerCase().includes(query) ||
            ad.id.toLowerCase().includes(query) ||
            ad.posterName.toLowerCase().includes(query) ||
            ad.posterPhone.includes(query) ||
            ad.location.toLowerCase().includes(query)
        );
      }
      return {
        data: filtered,
        total: filtered.length,
        page: params.page || 1,
        limit: params.limit || 20,
      };
    }
  },

  getPendingAds: async (params = {}) => {
    try {
      return await axiosClient.get('/api/v1/admin/ads/pending', { params });
    } catch (err) {
      let pending = localAdsState.filter((ad) => ad.status === 'PENDING');
      if (params.category && params.category !== 'ALL') {
        pending = pending.filter((ad) => ad.category === params.category);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        pending = pending.filter(
          (ad) =>
            ad.title.toLowerCase().includes(q) ||
            ad.id.toLowerCase().includes(q) ||
            ad.posterName.toLowerCase().includes(q)
        );
      }
      return {
        data: pending,
        total: pending.length,
      };
    }
  },

  getAdById: async (id) => {
    try {
      return await axiosClient.get(`/api/v1/admin/ads/${id}`);
    } catch (err) {
      const ad = localAdsState.find((a) => a.id === id);
      if (ad) return ad;
      throw new Error('Advertisement not found');
    }
  },

  approveAd: async (id) => {
    try {
      return await axiosClient.patch(`/api/v1/admin/ads/${id}/approve`);
    } catch (err) {
      localAdsState = localAdsState.map((ad) =>
        ad.id === id ? { ...ad, status: 'APPROVED' } : ad
      );
      return { success: true, message: 'Advertisement approved successfully' };
    }
  },

  rejectAd: async (id, reason, notes = '') => {
    try {
      return await axiosClient.patch(`/api/v1/admin/ads/${id}/reject`, { reason, notes });
    } catch (err) {
      localAdsState = localAdsState.map((ad) =>
        ad.id === id
          ? { ...ad, status: 'REJECTED', rejectionReason: reason, rejectionNotes: notes }
          : ad
      );
      return { success: true, message: 'Advertisement rejected successfully' };
    }
  },

  updateBadges: async (id, badges) => {
    try {
      return await axiosClient.patch(`/api/v1/admin/ads/${id}/badges`, badges);
    } catch (err) {
      localAdsState = localAdsState.map((ad) =>
        ad.id === id ? { ...ad, ...badges } : ad
      );
      return { success: true, message: 'Badges updated successfully' };
    }
  },

  unpublishAd: async (id) => {
    try {
      return await axiosClient.patch(`/api/v1/admin/ads/${id}/unpublish`);
    } catch (err) {
      localAdsState = localAdsState.map((ad) =>
        ad.id === id ? { ...ad, status: 'UNPUBLISHED' } : ad
      );
      return { success: true, message: 'Advertisement unpublished' };
    }
  },

  deleteAd: async (id) => {
    try {
      return await axiosClient.delete(`/api/v1/admin/ads/${id}`);
    } catch (err) {
      localAdsState = localAdsState.filter((ad) => ad.id !== id);
      return { success: true, message: 'Advertisement deleted successfully' };
    }
  },
};
