import axiosClient from './axiosClient';
import { MOCK_ADS } from '../mock/mockData';

let localAds = [...MOCK_ADS];

export const adsApi = {
  getAds: async (params = {}) => {
    try {
      return await axiosClient.get('/api/v1/ads', { params });
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
      return await axiosClient.get(`/api/v1/ads/${id}`);
    } catch (err) {
      const found = localAds.find((ad) => ad.id === id);
      if (found) return found;
      throw new Error('Listing not found');
    }
  },

  postAd: async (adData) => {
    try {
      const config = adData instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      return await axiosClient.post('/api/v1/ads', adData, config);
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
        status: 'PENDING_APPROVAL',
        isHighDemand: false,
        isFeatured: false,
        isFavorite: false,
      };
      localAds.unshift(newAd);
      return {
        success: true,
        ad: newAd,
        status: 'PENDING_APPROVAL',
        message: 'Your advertisement has been submitted successfully and is pending admin approval.',
      };
    }
  },

  getMyAds: async (status = 'ALL') => {
    try {
      return await axiosClient.get('/api/v1/ads/my-ads', { params: { status } });
    } catch (err) {
      let myAds = localAds.filter((ad) => ad.posterId === 'USR-8821' || ad.posterName === 'Gyana Prakash' || ad.posterName === 'Hoskote Realties');
      if (status && status !== 'ALL') {
        myAds = myAds.filter((ad) => ad.status === status);
      }
      return { data: myAds, total: myAds.length };
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
