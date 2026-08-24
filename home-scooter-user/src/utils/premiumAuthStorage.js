const PREMIUM_TOKEN_KEY = 'home_scooter_premium_token';
const PREMIUM_MEMBER_KEY = 'home_scooter_premium_member';

export const premiumAuthStorage = {
  getToken: () => {
    try {
      return localStorage.getItem(PREMIUM_TOKEN_KEY);
    } catch (e) {
      return null;
    }
  },

  setToken: (token) => {
    try {
      localStorage.setItem(PREMIUM_TOKEN_KEY, token);
    } catch (e) {}
  },

  getMember: () => {
    try {
      const data = localStorage.getItem(PREMIUM_MEMBER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setMember: (member) => {
    try {
      localStorage.setItem(PREMIUM_MEMBER_KEY, JSON.stringify(member));
    } catch (e) {}
  },

  clear: () => {
    try {
      localStorage.removeItem(PREMIUM_TOKEN_KEY);
      localStorage.removeItem(PREMIUM_MEMBER_KEY);
    } catch (e) {}
  },
};
