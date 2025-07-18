import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Header from '../common/Header';
import StatsCard from '../common/StatsCard';
import MenuManagement from './MenuManagement';
import InventoryManagement from './InventoryManagement';
import Analytics from './Analytics';
import ReservationManagement from './ReservationManagement';
import DailyCollections from './DailyCollections';
import { useOrder } from '../../contexts/OrderContext';
import { useData } from '../../contexts/DataContext';
import { 
  BarChart3, 
  Package, 
  UtensilsCrossed, 
  Calendar,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  CreditCard
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { getTotalRevenue, getOrderStats } = useOrder();
  const { inventory } = useData();
  const [activeTab, setActiveTab] = useState('dashboard');

  const orderStats = getOrderStats();
  const revenue = getTotalRevenue();
  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity).length;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'collections', label: 'Daily Collections', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return <MenuManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'reservations':
        return <ReservationManagement />;
      case 'collections':
        return <DailyCollections />;
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Revenue"
                value={`₹${revenue.toLocaleString()}`}
                icon={<DollarSign className="h-6 w-6 text-white" />}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                change="+12%"
              />
              <StatsCard
                title="Total Orders"
                value={orderStats.total}
                icon={<ShoppingCart className="h-6 w-6 text-white" />}
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                change="+8%"
              />
              <StatsCard
                title="Pending Orders"
                value={orderStats.pending}
                icon={<Users className="h-6 w-6 text-white" />}
                color="bg-gradient-to-r from-yellow-500 to-orange-500"
              />
              <StatsCard
                title="Low Stock Items"
                value={lowStockItems}
                icon={<Package className="h-6 w-6 text-white" />}
                color="bg-gradient-to-r from-red-500 to-pink-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                  >
                    <UtensilsCrossed className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Manage Menu</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Package className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Check Inventory</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    <Calendar className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Reservations</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('collections')}
                    className="p-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                  >
                    <CreditCard className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Collections</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <TrendingUp className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">View Analytics</span>
                  </button>
                </div>
              </div>

              <div className={`p-6 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      New order placed for Table 5
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Inventory alert: Low stock on Chicken
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      New reservation for tomorrow
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header title="Admin Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

export default AdminDashboard;