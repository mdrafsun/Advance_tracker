import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Auth Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';

// Layout Components
import DashboardLayout from './components/common/DashboardLayout';

// Page Components
import Dashboard from './components/dashboard/Dashboard';
import Income from './components/income/Income';
import Expenses from './components/expenses/Expenses';
import Budget from './components/budget/Budget';
import Savings from './components/savings/Savings';
import Reports from './components/reports/Reports';
import Notifications from './components/notifications/Notifications';
import Admin from './components/admin/Admin';
import Profile from './components/profile/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { state } = useApp();
  return state.isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { state } = useApp();
  return !state.isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/income" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Income />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/expenses" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Expenses />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/budget" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Budget />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/savings" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Savings />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Reports />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Notifications />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Admin />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Redirect root to dashboard if authenticated, otherwise to login */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
