import axiosClient from './axiosClient';
import { MOCK_VISITOR_WIN } from '../mock/mockData';
import { exportToCsv } from '../utils/export';

let localVisitorWinState = [...MOCK_VISITOR_WIN];

export const visitorWinApi = {
  getRegistrations: async (params = {}) => {
    try {
      return await axiosClient.get('/api/v1/admin/visitor-win', { params });
    } catch (err) {
      let filtered = [...localVisitorWinState];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            v.phone.includes(q) ||
            v.place.toLowerCase().includes(q) ||
            v.subject.toLowerCase().includes(q)
        );
      }
      return { data: filtered, total: filtered.length };
    }
  },

  deleteRegistration: async (id) => {
    try {
      return await axiosClient.delete(`/api/v1/admin/visitor-win/${id}`);
    } catch (err) {
      localVisitorWinState = localVisitorWinState.filter((v) => v.id !== id);
      return { success: true, message: 'Registration deleted' };
    }
  },

  exportVisitorWin: async () => {
    try {
      return await axiosClient.get('/api/v1/admin/visitor-win/export', { responseType: 'blob' });
    } catch (err) {
      exportToCsv('visitor_win_registrations', localVisitorWinState);
      return { success: true };
    }
  },
};
