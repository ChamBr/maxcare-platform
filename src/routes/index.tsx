import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageWrapper } from "@/components/layout/PageWrapper";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Warranties from "@/pages/Warranties";
import Services from "@/pages/Services";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminServices from "@/pages/admin/Services";
import AdminNotifications from "@/pages/admin/Notifications";
import AdminSettings from "@/pages/admin/Settings";
import Logs from "@/pages/admin/Logs";
import Subscriptions from "@/pages/admin/Subscriptions";
import ServiceRequests from "@/pages/admin/ServiceRequests";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
    <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
    <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
    <Route 
      path="/profile" 
      element={
        <ProtectedRoute>
          <PageWrapper showBreadcrumbs><Profile /></PageWrapper>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/warranties" 
      element={
        <ProtectedRoute>
          <PageWrapper showBreadcrumbs><Warranties /></PageWrapper>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/services" 
      element={
        <ProtectedRoute>
          <PageWrapper showBreadcrumbs><Services /></PageWrapper>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/*" 
      element={
        <ProtectedRoute>
          <PageWrapper showBreadcrumbs>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="logs" element={<Logs />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="service-requests" element={<ServiceRequests />} />
            </Routes>
          </PageWrapper>
        </ProtectedRoute>
      } 
    />
  </Routes>
);