import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CustomCursor from "@/components/cursor/CustomCursor";
import { useThemeStore } from "@/store/themeStore";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Landing from "@/pages/public/Landing";
import SignIn from "@/pages/public/SignIn";
import SignUp from "@/pages/public/SignUp";
import ResetPassword from "@/pages/public/ResetPassword";
import AuthCallback from "@/pages/public/AuthCallback";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import BrowseBooks from "@/pages/dashboard/BrowseBooks";
import MyBorrows from "@/pages/dashboard/MyBorrows";
import MyReservations from "@/pages/dashboard/MyReservations";
import MyFines from "@/pages/dashboard/MyFines";
import Profile from "@/pages/dashboard/Profile";
import Notifications from "@/pages/dashboard/Notifications";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminHome from "@/pages/admin/AdminHome";
import BookManagement from "@/pages/admin/BookManagement";
import MemberManagement from "@/pages/admin/MemberManagement";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminBorrows from "@/pages/admin/AdminBorrows";
import AdminReservations from "@/pages/admin/AdminReservations";
import AdminFines from "@/pages/admin/AdminFines";
import AdminReports from "@/pages/admin/AdminReports";
import AdminAnnouncements from "@/pages/admin/AdminAnnouncements";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ThemeInit = () => {
  const initTheme = useThemeStore((s) => s.initTheme);
  useEffect(() => {
    initTheme();
  }, [initTheme]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeInit />
      <CustomCursor />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Member Dashboard — requires member or admin (guests with role member) */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="member">
                <DashboardLayout><DashboardHome /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/books" element={
              <ProtectedRoute requiredRole="member">
                <DashboardLayout><BrowseBooks /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/borrows" element={
              <ProtectedRoute requiredRole="member">
                <DashboardLayout><MyBorrows /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/reservations" element={
              <ProtectedRoute requiredRole="member">
                <DashboardLayout><MyReservations /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/fines" element={
              <ProtectedRoute requiredRole="member">
                <DashboardLayout><MyFines /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute requiredRole="member">
                <DashboardLayout><Profile /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/notifications" element={
              <ProtectedRoute requiredRole="member">
                <DashboardLayout><Notifications /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Admin Dashboard — requires admin role */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminHome /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/books" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><BookManagement /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/members" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><MemberManagement /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminSettings /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/borrows" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminBorrows /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/reservations" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminReservations /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/fines" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminFines /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminReports /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/announcements" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout><AdminAnnouncements /></AdminLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
