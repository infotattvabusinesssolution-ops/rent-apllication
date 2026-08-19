import axiosClient from './axiosClient';
import { MOCK_LEADS } from '../mock/mockData';
import { exportToCsv } from '../utils/export';

let localLeadsState = [...MOCK_LEADS];

export const leadsApi = {
  getLeads: async (params = {}) => {
    try {
      return await axiosClient.get('/api/v1/admin/leads', { params });
    } catch (err) {
      let filtered = [...localLeadsState];
      if (params.status && params.status !== 'ALL') {
        filtered = filtered.filter((l) => l.status === params.status);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l.adTitle.toLowerCase().includes(q) ||
            l.buyerName.toLowerCase().includes(q) ||
            l.buyerPhone.includes(q) ||
            l.posterName.toLowerCase().includes(q)
        );
      }
      return { data: filtered, total: filtered.length };
    }
  },

  updateLeadStatus: async (id, status) => {
    try {
      return await axiosClient.patch(`/api/v1/admin/leads/${id}`, { status });
    } catch (err) {
      localLeadsState = localLeadsState.map((l) => (l.id === id ? { ...l, status } : l));
      return { success: true, message: `Lead marked as ${status}` };
    }
  },

  exportLeads: async () => {
    try {
      const response = await axiosClient.get('/api/v1/admin/leads/export', { responseType: 'blob' });
      return response;
    } catch (err) {
      // Fallback CSV export using local dataset
      exportToCsv('callback_leads', localLeadsState);
      return { success: true };
    }
  },
};
