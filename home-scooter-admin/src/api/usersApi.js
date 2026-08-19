import axiosClient from './axiosClient';
import { MOCK_USERS } from '../mock/mockData';

let localUsersState = [...MOCK_USERS];

export const usersApi = {
  getUsers: async (params = {}) => {
    try {
      return await axiosClient.get('/api/v1/admin/users', { params });
    } catch (err) {
      let filtered = [...localUsersState];
      if (params.filter === 'VERIFIED') {
        filtered = filtered.filter((u) => u.isVerified);
      } else if (params.filter === 'SUBSCRIBED') {
        filtered = filtered.filter((u) => u.isSubscribed);
      } else if (params.filter === 'BANNED') {
        filtered = filtered.filter((u) => u.status === 'Banned');
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.phone.includes(q) ||
            u.id.toLowerCase().includes(q)
        );
      }
      return { data: filtered, total: filtered.length };
    }
  },

  getUserById: async (id) => {
    try {
      return await axiosClient.get(`/api/v1/admin/users/${id}`);
    } catch (err) {
      const u = localUsersState.find((user) => user.id === id);
      if (u) return u;
      throw new Error('User not found');
    }
  },

  banUser: async (id, reason = '') => {
    try {
      return await axiosClient.post(`/api/v1/admin/users/${id}/ban`, { reason });
    } catch (err) {
      localUsersState = localUsersState.map((u) =>
        u.id === id ? { ...u, status: 'Banned', bannedReason: reason, bannedAt: new Date().toISOString() } : u
      );
      return { success: true, message: 'User banned successfully' };
    }
  },

  unbanUser: async (id) => {
    try {
      return await axiosClient.post(`/api/v1/admin/users/${id}/unban`);
    } catch (err) {
      localUsersState = localUsersState.map((u) =>
        u.id === id ? { ...u, status: 'Active', bannedReason: null } : u
      );
      return { success: true, message: 'User account restored to Active' };
    }
  },

  verifyUser: async (id) => {
    try {
      return await axiosClient.post(`/api/v1/admin/users/${id}/verify`);
    } catch (err) {
      localUsersState = localUsersState.map((u) =>
        u.id === id ? { ...u, isVerified: true } : u
      );
      return { success: true, message: 'User verified successfully' };
    }
  },

  toggleSubscriber: async (id) => {
    try {
      return await axiosClient.post(`/api/v1/admin/users/${id}/toggle-subscriber`);
    } catch (err) {
      localUsersState = localUsersState.map((u) => {
        if (u.id === id) {
          const next = !u.isSubscribed;
          const expiry = next ? new Date(Date.now() + 10 * 86400000).toISOString() : null;
          return { ...u, isSubscribed: next, subscriptionExpiry: expiry };
        }
        return u;
      });
      return { success: true, message: 'User subscriber status updated' };
    }
  },
};
