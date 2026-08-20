import axiosClient from './axiosClient';

const LOCAL_FAVS_KEY = 'homescooter_user_favorites';

export const getLocalFavIds = () => {
  try {
    const raw = localStorage.getItem(LOCAL_FAVS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const setLocalFavIds = (ids) => {
  try {
    localStorage.setItem(LOCAL_FAVS_KEY, JSON.stringify(ids));
  } catch (e) {}
};

export const favoritesApi = {
  getFavorites: async (userId) => {
    try {
      const res = await axiosClient.get('/v1/user/favorites', { params: { userId: userId || 'USR-3894' } });
      if (res && Array.isArray(res.data)) {
        if (res.data.length > 0) {
          const ids = res.data.map((ad) => String(ad.id || ad._id || ad.adId));
          setLocalFavIds(ids);
          return res;
        }
      }
    } catch (err) {}

    // Fallback: Fetch all ads and filter by local favorite IDs
    try {
      const localIds = getLocalFavIds();
      if (localIds.length === 0) {
        return { success: true, data: [], count: 0 };
      }

      const allAdsRes = await axiosClient.get('/v1/user/ads');
      const allAds = allAdsRes?.data || [];

      const filtered = allAds.filter((ad) =>
        localIds.includes(String(ad.id)) ||
        localIds.includes(String(ad.adId)) ||
        localIds.includes(String(ad._id))
      ).map((ad) => ({ ...ad, isFavorite: true }));

      return { success: true, data: filtered, count: filtered.length };
    } catch (e) {
      return { success: true, data: [], count: 0 };
    }
  },

  toggleFavorite: async (adId, userId) => {
    const cleanAdId = String(adId).trim();
    let localIds = getLocalFavIds();
    let isFav = false;

    if (localIds.includes(cleanAdId)) {
      localIds = localIds.filter((id) => id !== cleanAdId);
      isFav = false;
    } else {
      localIds.push(cleanAdId);
      isFav = true;
    }
    setLocalFavIds(localIds);

    try {
      const res = await axiosClient.post('/v1/user/favorites/toggle', { adId: cleanAdId, userId });
      return {
        success: true,
        isFavorite: res?.isFavorite !== undefined ? res.isFavorite : isFav,
        message: isFav ? 'Added to Saved Favorites' : 'Removed from Favorites',
      };
    } catch (err) {
      return {
        success: true,
        isFavorite: isFav,
        message: isFav ? 'Added to Saved Favorites' : 'Removed from Favorites',
      };
    }
  },
};
