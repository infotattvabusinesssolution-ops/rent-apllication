import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.name === 'Rahul Sharma') parsed.name = 'Home & Scooter';
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && user.name === 'Rahul Sharma') {
      const updated = { ...user, name: 'Home & Scooter' };
      setUser(updated);
      localStorage.setItem('admin_user', JSON.stringify(updated));
    }
  }, [user]);


  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      setUser(res.user);
      setToken(res.token);
      toast.success('Successfully logged into Admin Portal');
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Invalid email or password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
    toast.info('Logged out from Admin Portal');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
