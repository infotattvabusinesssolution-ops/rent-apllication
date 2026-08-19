import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from '../components/layout/AdminLayout';

import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { AdsList } from '../pages/AdsList';
import { PendingAds } from '../pages/PendingAds';
import { AdDetail } from '../pages/AdDetail';
import { BannerList } from '../pages/BannerList';
import { BannerCreate } from '../pages/BannerCreate';
import { SubscriptionsList } from '../pages/SubscriptionsList';
import { UsersList } from '../pages/UsersList';
import { UserDetail } from '../pages/UserDetail';
import { LeadsList } from '../pages/LeadsList';
import { ReportsList } from '../pages/ReportsList';
import { VisitorWinList } from '../pages/VisitorWinList';
import { Analytics } from '../pages/Analytics';
import { Settings } from '../pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="ads" element={<AdsList />} />
        <Route path="ads/pending" element={<PendingAds />} />
        <Route path="ads/:id" element={<AdDetail />} />
        
        <Route path="banners" element={<BannerList />} />
        <Route path="banners/create" element={<BannerCreate />} />
        
        <Route path="subscriptions" element={<SubscriptionsList />} />
        
        <Route path="users" element={<UsersList />} />
        <Route path="users/:id" element={<UserDetail />} />
        
        <Route path="leads" element={<LeadsList />} />
        <Route path="reports" element={<ReportsList />} />
        <Route path="visitor-win" element={<VisitorWinList />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
