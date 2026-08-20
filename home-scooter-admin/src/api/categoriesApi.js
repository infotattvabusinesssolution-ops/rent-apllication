import axiosClient from './axiosClient';

export const categoriesApi = {
  // Get all categories
  getCategories: async () => {
    const res = await axiosClient.get('/api/v1/admin/categories');
    return res;
  },

  // Create new category
  createCategory: async (categoryData) => {
    const res = await axiosClient.post('/api/v1/admin/categories', categoryData);
    return res;
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const res = await axiosClient.put(`/api/v1/admin/categories/${id}`, categoryData);
    return res;
  },

  // Toggle active/inactive status
  toggleCategoryStatus: async (id) => {
    const res = await axiosClient.patch(`/api/v1/admin/categories/${id}/toggle`);
    return res;
  },

  // Delete category
  deleteCategory: async (id) => {
    const res = await axiosClient.delete(`/api/v1/admin/categories/${id}`);
    return res;
  },
};

