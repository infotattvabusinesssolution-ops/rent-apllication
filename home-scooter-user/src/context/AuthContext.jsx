import React, { createContext, useContext, useState } from 'react';
import { authApi } from '../api/authApi';
import { authStorage } from '../utils/authStorage';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [token, setToken] = useState(() => authStorage.getToken());
  const [selectedLocation, setSelectedLocation] = useState('Bangalore, Karnataka');
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      setUser(res.user);
      setToken(res.token);
      toast.success('Welcome back to Home & Scooter Marketplace!');
      return true;
    } catch (err) {
      toast.error('Authentication failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
    toast.info('Logged out from marketplace');
  };

  const updateLocation = (loc) => {
    setSelectedLocation(loc);
    toast.success(`Location updated to ${loc}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        selectedLocation,
        isLoading,
        login,
        logout,
        updateLocation,
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
