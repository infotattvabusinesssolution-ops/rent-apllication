import axiosClient from './axiosClient';
import { CATEGORIES, CATEGORY_LIST, PROPERTY_SUBCATEGORY_LIST } from '../constants/categories';

export const categoryApi = {
  getCategories: async () => {
    try {
      const res = await axiosClient.get('/v1/user/categories');
      const rawList = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      if (rawList.length > 0) {
        return rawList.filter((c) => c.isActive !== false);
      }
      return CATEGORY_LIST.map((name) => ({
        id: name,
        name: name,
        parent: 'None (Main Category)',
        description: name === CATEGORIES.PROPERTIES ? 'Rent & Sale Houses, Shops & PGs' : '',
        icon: name.includes('Layout') ? '🗺️' : name.includes('Scooter') ? '🛵' : name.includes('Services') ? '🛠️' : name.includes('Property') || name.includes('House') || name.includes('Shop') ? '🏢' : '📦',
        isActive: true,
      }));
    } catch (err) {
      return CATEGORY_LIST.map((name) => ({
        id: name,
        name: name,
        parent: 'None (Main Category)',
        description: name === CATEGORIES.PROPERTIES ? 'Rent & Sale Houses, Shops & PGs' : '',
        icon: name.includes('Layout') ? '🗺️' : name.includes('Scooter') ? '🛵' : name.includes('Services') ? '🛠️' : name.includes('Property') || name.includes('House') || name.includes('Shop') ? '🏢' : '📦',
        isActive: true,
      }));
    }
  },
};


