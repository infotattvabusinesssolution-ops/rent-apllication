import axiosClient from './axiosClient';
import { MOCK_ADS } from '../mock/mockData';

let localAds = [...MOCK_ADS];

export const adsApi = {
  getAds: async (params = {}) => {
    try {
      const res = await axiosClient.get('/v1/user/ads', { params });
      return res.data;
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
      return res.data;
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
      return res.data;
    } catch (err) {
      const newAd = {
        id: `AD${Math.floor(1000 + Math.random() * 9000)}`,
        title: adData.title || 'New Marketplace Listing',
        description: adData.description || 'Listing description',
        price: Number(adData.price) || 50000,
        priceUnit: adData.priceUnit || '₹',
        location: adData.location || 'Bangalore',
        city: 'Bangalore',
        distanceKm: 2.0,
        category: adData.category || 'Layout Sites',
        propertySubType: adData.propertySubType || null,
        imageUrls: adData.imageUrls || [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
        ],
        posterName: 'Gyana Prakash',
        posterPhone: '+91 98765 43210',
        postedAt: new Date().toISOString(),
        timeAgo: 'Just now',
        viewsCount: 1,
        formattedViews: '1 view',
        status: 'APPROVED',
        isHighDemand: false,
        isFeatured: false,
        isFavorite: false,
      };
      localAds.unshift(newAd);
      return {
        success: true,
        ad: newAd,
        status: 'APPROVED',
        message: 'Your advertisement has been submitted successfully.',
      };
    }
  },

  getMyAds: async (status = 'ALL') => {
    try {
      const res = await axiosClient.get('/v1/user/my-ads', { params: { status } });
      return res.data;
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
      return res.data;
    } catch (err) {
      localAds = localAds.map((ad) => (ad.id === id ? { ...ad, ...adData } : ad));
      return { success: true, message: 'Ad updated' };
    }
  },

  deleteAd: async (id) => {
    try {
      const res = await axiosClient.delete(`/v1/user/my-ads/${id}`);
      return res.data;
    } catch (err) {
      localAds = localAds.filter((ad) => ad.id !== id);
      return { success: true, message: 'Ad deleted' };
    }
  },



  toggleFavorite: async (id) => {
    try {
      return await axiosClient.post(`/api/v1/ads/${id}/favorite`);
    } catch (err) {
      localAds = localAds.map((ad) =>
        ad.id === id ? { ...ad, isFavorite: !ad.isFavorite } : ad
      );
      const target = localAds.find((a) => a.id === id);
      return { success: true, isFavorite: target?.isFavorite };
    }
  },
};
