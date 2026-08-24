const TOKEN_KEY = 'education_student_token';
const STUDENT_KEY = 'education_student_data';

export const educationAuthStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),

  getStudent: () => {
    const data = localStorage.getItem(STUDENT_KEY);
    try {
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },
  setStudent: (student) => localStorage.setItem(STUDENT_KEY, JSON.stringify(student)),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STUDENT_KEY);
  },

  isAuthenticated: () => {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};
