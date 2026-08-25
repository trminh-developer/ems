import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { Loading } from '../components/common';
import { useAuth } from '../hooks/useAuth';

const LoginView = lazy(() => import('../views/auth/LoginView'));
const RegisterView = lazy(() => import('../views/auth/RegisterView'));
const ForgotPasswordView = lazy(() => import('../views/auth/ForgotPasswordView'));
const HomeView = lazy(() => import('../views/HomeView'));
const DiscoverView = lazy(() => import('../views/DiscoverView'));
const SearchView = lazy(() => import('../views/SearchView'));
const MatchesView = lazy(() => import('../views/MatchesView'));
const MessagesView = lazy(() => import('../views/MessagesView'));
const ProfileView = lazy(() => import('../views/ProfileView'));
const NotificationsView = lazy(() => import('../views/NotificationsView'));
const SettingsView = lazy(() => import('../views/SettingsView'));

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Suspense fallback={<Loading text="Đang tải..." />}>
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/forgot-password" element={<ForgotPasswordView />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomeView />} />
          <Route path="/discover" element={<DiscoverView />} />
          <Route path="/search" element={<SearchView />} />
          <Route path="/matches" element={<MatchesView />} />
          <Route path="/messages" element={<MessagesView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/profile/:id" element={<ProfileView />} />
          <Route path="/notifications" element={<NotificationsView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
