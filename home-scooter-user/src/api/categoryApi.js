import axiosClient from './axiosClient';
import { CATEGORIES, CATEGORY_LIST, PROPERTY_SUBCATEGORY_LIST } from '../constants/categories';

export const categoryApi = {
  getCategories: async () => {
    try {
      const res = await axiosClient.get('/v1/user/categories');
      const rawList = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      return rawList.filter((c) => c.isActive !== false);
    } catch (err) {
      console.error('Error fetching categories from database:', err);
      return [];
    }
  },
};


