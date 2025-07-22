import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useOrder } from '../../contexts/OrderContext';
import { useData } from '../../contexts/DataContext';
import Header from '../common/Header';
import FloatingActionButton from '../common/FloatingActionButton';
import NotificationToast, { ToastNotification } from '../common/NotificationToast';
import OrderTaking from './OrderTaking';
import OrderManagement from './OrderManagement';
import PaymentProcessing from './PaymentProcessing';
import BillGeneration from './BillGeneration';
import TableManagement from './TableManagement';
import KitchenDisplay from './KitchenDisplay';
import { 
  ShoppingCart, 
  ClipboardList, 
  Users, 
  CheckCircle,
  CreditCard,
  Receipt,
  MapPin,
  ChefHat,
  Zap
} from 'lucide-react';

const StaffDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { orders, getOrderStats } = useOrder();
  const { tables } = useData();
  const [activeTab, setActiveTab] = useState('orders');
  const [rushHourMode, setRushHourMode] = useState(false);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = (notification: Omit<ToastNotification, 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString()
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  const orderStats = getOrderStats();
  const occupiedTables = tables.filter(table => table.status === 'occupied').length;

  const tabs = [
    { id: 'orders', label: 'Take Orders', icon: ShoppingCart },
    { id: 'manage', label: 'Manage Orders', icon: ClipboardList },
    { id: 'tables', label: 'Table Management', icon: MapPin },
    { id: 'kitchen', label: 'Kitchen Display', icon: ChefHat },
    { id: 'payments', label: 'Process Payments', icon: CreditCard },
    { id: 'bills', label: 'Generate Bills', icon: Receipt },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'manage':
        return <OrderManagement />;
      case 'tables':
        return <TableManagement />;
      case 'kitchen':
        return <KitchenDisplay />;
      case 'payments':
        return <PaymentProcessing />;
      case 'bills':
        return <BillGeneration />;
      default:
        return <OrderTaking rushHourMode={rushHourMode} />;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark ? 'bg-gray-900' : rushHourMode ? 'bg-gradient-to-br from-red-50 to-orange-50' : 'animated-bg'
    }`}>
      <Header title="Staff Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Rush Hour Toggle */}
        <div className="mb-6 flex items-center justify-between animate-slide-down">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Zap className={`h-6 w-6 transition-all duration-300 ${
                rushHourMode ? 'text-red-500 animate-pulse' : 'text-gray-400'
              }`} />
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Rush Hour Mode
              </span>
              <button
                onClick={() => setRushHourMode(!rushHourMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                  rushHourMode ? 'bg-red-500 shadow-glow-gold' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-all duration-300 ${
                  rushHourMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            {rushHourMode && (
              <div className="flex items-center space-x-2 animate-slide-in-right">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <span className="text-red-600 font-medium text-sm">High-Speed Mode Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${rushHourMode ? 'hidden' : ''}`}>
          <div className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 animate-fade-in ${
            isDark 
              ? 'glass-dark border-gray-700' 
              : 'glass border-white/20'
          } shadow-xl hover:shadow-glow-gold`} style={{ animationDelay: '0ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Pending Orders
                </p>
                <p className={`text-3xl font-bold mt-1 gradient-text ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {orderStats.pending}
                </p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 animate-float">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 animate-fade-in ${
            isDark 
              ? 'glass-dark border-gray-700' 
              : 'glass border-white/20'
          } shadow-xl hover:shadow-glow-gold`} style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Orders
                </p>
                <p className={`text-3xl font-bold mt-1 gradient-text ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {orderStats.total}
                </p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-float" style={{ animationDelay: '1s' }}>
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 animate-fade-in ${
            isDark 
              ? 'glass-dark border-gray-700' 
              : 'glass border-white/20'
          } shadow-xl hover:shadow-glow-gold`} style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Occupied Tables
                </p>
                <p className={`text-3xl font-bold mt-1 gradient-text ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {occupiedTables}
                </p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-float" style={{ animationDelay: '2s' }}>
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 animate-fade-in ${
            isDark 
              ? 'glass-dark border-gray-700' 
              : 'glass border-white/20'
          } shadow-xl hover:shadow-glow-gold`} style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Completed Orders
                </p>
                <p className={`text-3xl font-bold mt-1 gradient-text ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {orderStats.completed}
                </p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-float" style={{ animationDelay: '3s' }}>
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 animate-slide-up">
          <nav className={`flex space-x-1 p-1 rounded-xl ${
            isDark ? 'glass-dark' : 'glass'
          } backdrop-blur-xl`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-glow-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onOrderClick={() => setActiveTab('orders')}
        onPaymentClick={() => setActiveTab('payments')}
        onBillClick={() => setActiveTab('bills')}
        onTableClick={() => setActiveTab('tables')}
      />

      {/* Notification Toasts */}
      <NotificationToast
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default StaffDashboard;