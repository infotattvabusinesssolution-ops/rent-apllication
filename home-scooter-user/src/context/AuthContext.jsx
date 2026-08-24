import React, { createContext, useContext, useState } from 'react';
import { authApi } from '../api/authApi';
import { authStorage } from '../utils/authStorage';
import axiosClient from '../api/axiosClient';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [token, setToken] = useState(() => authStorage.getToken());
  const [selectedLocation, setSelectedLocation] = useState(() => localStorage.getItem('user_selected_location') || 'Bangalore, Karnataka');
  const [isLoading, setIsLoading] = useState(false);

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(userData);
      if (res?.success && res?.user) {
        setUser(res.user);
        setToken(res.token);
        toast.success(res.message || 'Account created successfully!');
        return true;
      }
      toast.error(res?.message || 'Registration failed. Please try again.');
      return false;
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      if (res?.success && res?.user) {
        setUser(res.user);
        setToken(res.token);
        toast.success(res.message || 'Welcome back to Home & Scooter Marketplace!');
        return true;
      }
      toast.error(res?.message || 'Login failed. Please check credentials.');
      return false;
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Authentication failed');
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

  const updateLocation = (loc, coords = {}) => {
    if (!loc) return;
    setSelectedLocation(loc);
    localStorage.setItem('user_selected_location', loc);

    // Save location to MongoDB in real-time
    try {
      axiosClient
        .put('/v1/user/auth/location', {
          location: loc,
          latitude: coords.latitude || null,
          longitude: coords.longitude || null,
          userId: user?.id || user?.userId || null,
          source: coords.latitude ? 'GPS' : 'MANUAL_SEARCH',
        })
        .catch(() => {});
    } catch (e) {
      // Ignore background sync error
    }

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
        register,
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
