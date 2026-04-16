import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Home } from '@/features/Home';
import { HowItWorks } from '@/features/HowItWorks';
import { Dashboard } from '@/features/Dashboard';
import { Wishlist } from '@/features/Wishlist';
import { VehicleList } from '@/features/vehicles/VehicleList';
import { VehicleDetail } from '@/features/vehicles/VehicleDetail';
import { Login } from '@/features/auth/Login';
import { SignUp } from '@/features/auth/SignUp';
import { ForgotPassword } from '@/features/auth/ForgotPassword';
import { EmailVerification } from '@/features/auth/EmailVerification';
import { AdminDashboard } from '@/features/admin/AdminDashboard';

export const AppRoutes: React.FC = () => (
  <AnimatePresence mode="wait">
    <Routes>
      {/* Public layout routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/vehicles" element={<VehicleList />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/wishlist"
          element={<ProtectedRoute><Wishlist /></ProtectedRoute>}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>}
        />
      </Route>

      {/* Auth routes (no layout) */}
      <Route
        path="/login"
        element={
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
            <Login />
          </div>
        }
      />
      <Route
        path="/signup"
        element={
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
            <SignUp />
          </div>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
            <ForgotPassword />
          </div>
        }
      />
      <Route
        path="/verify-email"
        element={
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
            <EmailVerification />
          </div>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AnimatePresence>
);
