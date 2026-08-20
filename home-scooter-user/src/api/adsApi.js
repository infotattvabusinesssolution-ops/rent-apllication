import axiosClient from './axiosClient';
import { MOCK_ADS } from '../mock/mockData';

let localAds = [...MOCK_ADS];

export const adsApi = {
  getAds: async (params = {}) => {
    try {
      const res = await axiosClient.get('/v1/user/ads', { params });
      return res;
    } catch (err) {
      let result = localAds.filter((ad) => ad.status === 'APPROVED');
      
      if (params.category && params.category !== 'ALL') {
        result = result.filter((ad) => ad.category === params.category);
      }
      if (params.propertySubType && params.propertySubType !== 'ALL') {
        result = result.filter((ad) => ad.propertySubType === params.propertySubType);
      }
      if (params.distanceKm) {
        result = result.filter((ad) => ad.distanceKm <= params.distanceKm);
      }
      if (params.isFeatured) {
        result = result.filter((ad) => ad.isFeatured);
      }
      if (params.isHighDemand) {
        result = result.filter((ad) => ad.isHighDemand);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        result = result.filter(
          (ad) =>
            ad.title.toLowerCase().includes(q) ||
            ad.description.toLowerCase().includes(q) ||
            ad.location.toLowerCase().includes(q) ||
            ad.category.toLowerCase().includes(q)
        );
      }

      // Sort
      if (params.sort === 'price_asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (params.sort === 'price_desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (params.sort === 'views') {
        result.sort((a, b) => b.viewsCount - a.viewsCount);
      }

      return { data: result, total: result.length };
    }
  },

  getAdById: async (id) => {
    try {
      const res = await axiosClient.get(`/v1/user/ads/${id}`);
      return res;
    } catch (err) {
      const found = localAds.find((ad) => ad.id === id);
      if (found) return found;
      throw new Error('Listing not found');
    }
  },

  postAd: async (adData) => {
    try {
      const config = adData instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      const res = await axiosClient.post('/v1/user/ads', adData, config);
      return res;
    } catch (err) {
      console.error('API PostAd Error:', err);
      throw err;
    }
  },



  getMyAds: async (status = 'ALL') => {
    try {
      const res = await axiosClient.get('/v1/user/my-ads', { params: { status } });
      return res;
    } catch (err) {
      let myAds = localAds.filter((ad) => ad.posterId === 'USR-8821' || ad.posterName === 'Gyana Prakash' || ad.posterName === 'Hoskote Realties');
      if (status && status !== 'ALL') {
        myAds = myAds.filter((ad) => ad.status === status);
      }
      return { data: myAds, total: myAds.length };
    }
  },

  updateAd: async (id, adData) => {
    try {
      const res = await axiosClient.put(`/v1/user/my-ads/${id}`, adData);
      return res;
    } catch (err) {
      localAds = localAds.map((ad) => (ad.id === id ? { ...ad, ...adData } : ad));
      return { success: true, message: 'Ad updated' };
    }
  },

  deleteAd: async (id) => {
    try {
      const res = await axiosClient.delete(`/v1/user/my-ads/${id}`);
      return res;
    } catch (err) {
      localAds = localAds.filter((ad) => ad.id !== id);
      return { success: true, message: 'Ad deleted' };
    }
  },



  toggleFavorite: async (id, userId) => {
    try {
      const res = await axiosClient.post('/v1/user/favorites/toggle', { adId: id, userId });
      return res;
    } catch (err) {
      localAds = localAds.map((ad) =>
        ad.id === id ? { ...ad, isFavorite: !ad.isFavorite } : ad
      );
      const target = localAds.find((a) => a.id === id);
      return { success: true, isFavorite: target?.isFavorite };
    }
  },
};
