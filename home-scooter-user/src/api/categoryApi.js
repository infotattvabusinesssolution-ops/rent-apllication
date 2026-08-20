import axiosClient from './axiosClient';
import { CATEGORIES, CATEGORY_LIST, PROPERTY_SUBCATEGORY_LIST } from '../constants/categories';

export const categoryApi = {
  getCategories: async () => {
    try {
      const res = await axiosClient.get('/v1/user/categories');
      return res;
    } catch (err) {
      return {
        success: true,
        data: CATEGORY_LIST.map((name) => ({
          title: name,
          slug: name.toLowerCase().replace(/ /g, '-'),
          subcategories: name === CATEGORIES.PROPERTIES ? PROPERTY_SUBCATEGORY_LIST : [],
        })),
      };
    }
  },
};

