import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from './auth/LoginPage';
import AdminDashboard from './admin/AdminDashboard';
import StaffDashboard from './staff/StaffDashboard';
import CustomerMenu from './customer/CustomerMenu';

const AppRouter: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Check if accessing customer menu via QR code
    const params = new URLSearchParams(window.location.search);
    const tableId = params.get('table');
    if (tableId) {
      return <CustomerMenu tableId={tableId} />;
    }
    return <LoginPage />;
  }

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'staff':
      return <StaffDashboard />;
    default:
      return <LoginPage />;
  }
};

export default AppRouter;