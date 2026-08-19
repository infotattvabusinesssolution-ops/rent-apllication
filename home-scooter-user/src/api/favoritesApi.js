import axiosClient from './axiosClient';
import { MOCK_ADS } from '../mock/mockData';

export const favoritesApi = {
  getFavorites: async () => {
    try {
      return await axiosClient.get('/api/v1/favorites');
    } catch (err) {
      const favs = MOCK_ADS.filter((ad) => ad.isFavorite);
      return { data: favs, total: favs.length };
    }
  },
};
