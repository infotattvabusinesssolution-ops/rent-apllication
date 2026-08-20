import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserLayout } from '../components/layout/UserLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Categories } from '../pages/Categories';
import { LayoutSites } from '../pages/LayoutSites';
import { Properties } from '../pages/Properties';
import { PropertySubcategory } from '../pages/PropertySubcategory';
import { ElectricScooters } from '../pages/ElectricScooters';
import { Services } from '../pages/Services';
import { Others } from '../pages/Others';
import { NearMe } from '../pages/NearMe';
import { NewAds } from '../pages/NewAds';
import { TopViewed } from '../pages/TopViewed';
import { SearchResults } from '../pages/SearchResults';
import { AdDetail } from '../pages/AdDetail';
import { Sell } from '../pages/Sell';
import { PostAd } from '../pages/PostAd';
import { MyAds } from '../pages/MyAds';
import { Favorites } from '../pages/Favorites';
import { Chats } from '../pages/Chats';
import { ChatDetail } from '../pages/ChatDetail';
import { Notifications } from '../pages/Notifications';
import { Profile } from '../pages/Profile';
import { PrivacySafety } from '../pages/PrivacySafety';
import { Subscription } from '../pages/Subscription';
import { VisitorWin } from '../pages/VisitorWin';
import { Filters } from '../pages/Filters';
import { NotFound } from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        {/* Public Auth Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected Routes (Redirects to /login if unauthenticated) */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/layout-sites" element={<LayoutSites />} />
          <Route path="categories/properties" element={<Properties />} />
          <Route path="properties/:subcategory" element={<PropertySubcategory />} />
          <Route path="categories/electric-scooters" element={<ElectricScooters />} />
          <Route path="categories/services" element={<Services />} />
          <Route path="categories/others" element={<Others />} />
          <Route path="near-me" element={<NearMe />} />
          <Route path="new-ads" element={<NewAds />} />
          <Route path="top-viewed" element={<TopViewed />} />
          <Route path="filters" element={<Filters />} />
          <Route path="search" element={<SearchResults />} />

          <Route path="ad/:id" element={<AdDetail />} />
          <Route path="ads/:id" element={<AdDetail />} />

          <Route path="sell" element={<Sell />} />
          <Route path="post-ad" element={<PostAd />} />
          <Route path="my-ads" element={<MyAds />} />
          <Route path="create-ad" element={<PostAd />} />
          <Route path="favorites" element={<Favorites />} />

          <Route path="chats" element={<Chats />} />
          <Route path="chats/:chatId" element={<ChatDetail />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="privacy-safety" element={<PrivacySafety />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="visitor-win" element={<VisitorWin />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
