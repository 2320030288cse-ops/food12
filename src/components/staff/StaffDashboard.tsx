import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useOrder } from '../../contexts/OrderContext';
import { useData } from '../../contexts/DataContext';
import Header from '../common/Header';
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
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header title="Staff Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Rush Hour Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Zap className={`h-6 w-6 ${rushHourMode ? 'text-red-500' : 'text-gray-400'}`} />
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Rush Hour Mode
              </span>
              <button
                onClick={() => setRushHourMode(!rushHourMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  rushHourMode ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  rushHourMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${rushHourMode ? 'hidden' : ''}`}>
          <div className={`p-6 rounded-xl border ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Pending Orders
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {orderStats.pending}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Orders
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {orderStats.total}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Occupied Tables
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {occupiedTables}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Completed Orders
                </p>
                <p className={`text-2xl font-bold mt-1 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {orderStats.completed}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-yellow-600 shadow-sm'
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
        {renderContent()}
      </div>
    </div>
  );
};

export default StaffDashboard;