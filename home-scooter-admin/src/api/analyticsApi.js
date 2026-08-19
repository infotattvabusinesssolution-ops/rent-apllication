import axiosClient from './axiosClient';
import { MOCK_DASHBOARD_STATS } from '../mock/mockData';

export const analyticsApi = {
  getAnalytics: async (range = '30d') => {
    try {
      return await axiosClient.get('/api/v1/admin/analytics', { params: { range } });
    } catch (err) {
      return {
        ...MOCK_DASHBOARD_STATS,
        topAds: [
          { title: '30x40 Hoskote Corner Plot', views: '25.4K', inquiries: 142, category: 'Layout Sites' },
          { title: 'Commercial Office Space - Indiranagar', views: '31.2K', inquiries: 98, category: 'Properties' },
          { title: 'Modern 3 BHK Apartment - Whitefield', views: '18.2K', inquiries: 76, category: 'Properties' },
          { title: 'Ather 450X Gen 3 Scooter', views: '9.4K', inquiries: 54, category: 'Electric Scooters' },
        ],
      };
    }
  },
};
