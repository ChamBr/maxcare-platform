import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Warranties from "./pages/Warranties";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminServices from "./pages/admin/Services";
import AdminNotifications from "./pages/admin/Notifications";
import AdminSettings from "./pages/admin/Settings";
import Logs from "./pages/admin/Logs";
import Subscriptions from "./pages/admin/Subscriptions";
import ServiceRequests from "./pages/admin/ServiceRequests";

const queryClient = new QueryClient();

const PageWrapper = ({ children, showBreadcrumbs = false }: { children: React.ReactNode, showBreadcrumbs?: boolean }) => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6"
    >
      {showBreadcrumbs && <Breadcrumbs />}
      {children}
    </motion.div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
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
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
