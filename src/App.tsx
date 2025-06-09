
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthInit } from "@/hooks/useAuthInit";
import { useAuthStore } from "@/stores/authStore";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/dashboard/Orders";
import PackingProductOverview from "./pages/dashboard/PackingProductOverview";
import PackingProductDetail from "./pages/dashboard/PackingProductDetail";
import Deliveries from "./pages/dashboard/Deliveries";
import Products from "./pages/dashboard/Products";
import Customers from "./pages/dashboard/Customers";
import Reports from "./pages/dashboard/Reports";
import Admin from "./pages/dashboard/Admin";
import DisplaySettings from "./pages/dashboard/DisplaySettings";
import NotFound from "./pages/NotFound";

// Display Pages
import SharedDisplay from "./pages/display/SharedDisplay";
import CustomerDisplay from "./pages/display/CustomerDisplay";

// Components
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function AppContent() {
  const { isLoading } = useAuthInit();
  const { user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Laster applikasjon...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Index />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        
        {/* Display routes (public) */}
        <Route path="/display/shared" element={<SharedDisplay />} />
        <Route path="/display/:displayUrl" element={<CustomerDisplay />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={
            <AuthLayout>
              <Dashboard />
            </AuthLayout>
          } />
          <Route path="/dashboard/orders" element={
            <AuthLayout>
              <Orders />
            </AuthLayout>
          } />
          <Route path="/dashboard/orders/packing/:date" element={
            <AuthLayout>
              <PackingProductOverview />
            </AuthLayout>
          } />
          <Route path="/dashboard/orders/packing/:date/:productId" element={
            <AuthLayout>
              <PackingProductDetail />
            </AuthLayout>
          } />
          <Route path="/dashboard/deliveries" element={
            <AuthLayout>
              <Deliveries />
            </AuthLayout>
          } />
          <Route path="/dashboard/products" element={
            <AuthLayout>
              <Products />
            </AuthLayout>
          } />
          <Route path="/dashboard/customers" element={
            <AuthLayout>
              <Customers />
            </AuthLayout>
          } />
          <Route path="/dashboard/reports" element={
            <AuthLayout>
              <Reports />
            </AuthLayout>
          } />
          <Route path="/dashboard/admin" element={
            <AuthLayout>
              <Admin />
            </AuthLayout>
          } />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
