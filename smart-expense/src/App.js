// smart-expense/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useApp } from './context/AppContext';

import DashboardLayout from './components/common/DashboardLayout';
import Dashboard from './components/dashboard/Dashboard';

import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';

import Expenses from './components/expenses/Expenses';
import Income from './components/income/Income';
import Savings from './components/savings/Savings';
import Loans from './components/loans/Loans';
import Budget from './components/budget/Budget';
import Reports from './components/reports/Reports';
import Notifications from './components/notifications/Notifications';
import Profile from './components/profile/Profile';
import Admin from './components/admin/Admin';

const RequireAuth = () => {
  const { state } = useApp();
  if (!state.initialized) {
    // Splash while context boots (prevents “UI gone”)
    return <div style={{padding: 24, fontFamily: 'sans-serif'}}>Loading…</div>;
  }
  if (!state.isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const RootRedirect = () => {
  const { state } = useApp();
  if (!state.initialized) return <div style={{padding: 24, fontFamily: 'sans-serif'}}>Loading…</div>;
  return state.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root decides based on auth */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected */}
        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
