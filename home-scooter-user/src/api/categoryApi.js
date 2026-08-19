import axiosClient from './axiosClient';
import { CATEGORIES, CATEGORY_LIST, PROPERTY_SUBCATEGORY_LIST } from '../constants/categories';

export const categoryApi = {
  getCategories: async () => {
    try {
      return await axiosClient.get('/api/v1/categories');
    } catch (err) {
      return {
        data: CATEGORY_LIST.map((name) => ({
          title: name,
          slug: name.toLowerCase().replace(/ /g, '-'),
          subcategories: name === CATEGORIES.PROPERTIES ? PROPERTY_SUBCATEGORY_LIST : [],
        })),
      };
    }
  },
};
