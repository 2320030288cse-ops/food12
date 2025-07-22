import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Header from '../common/Header';
import StatsCard from '../common/StatsCard';
import AnimatedCard from '../common/AnimatedCard';
import LoadingSpinner from '../common/LoadingSpinner';
import MenuManagement from './MenuManagement';
import InventoryManagement from './InventoryManagement';
import Analytics from './Analytics';
import ReservationManagement from './ReservationManagement';
import DailyCollections from './DailyCollections';
import AIInsights from '../advanced/AIInsights';
import RealTimeTracking from '../advanced/RealTimeTracking';
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
  const [isLoading, setIsLoading] = useState(false);

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
    { id: 'ai-insights', label: 'AI Insights', icon: TrendingUp },
    { id: 'tracking', label: 'Live Tracking', icon: Users },
  ];

  const handleTabChange = (tabId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsLoading(false);
    }, 300);
  };
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      );
    }

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
      case 'ai-insights':
        return <AIInsights />;
      case 'tracking':
        return <RealTimeTracking />;
      default:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className={`p-8 rounded-2xl ${
              isDark ? 'glass-dark' : 'glass'
            } backdrop-blur-xl animate-fade-in`}>
              <div className="text-center">
                <h2 className={`text-4xl font-bold gradient-text mb-4`}>
                  Welcome to GS Restaurant Admin
                </h2>
                <p className={`text-lg ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Manage your restaurant operations with ease and efficiency
                </p>
              </div>
            </div>

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
              <AnimatedCard 
                className={`p-6 rounded-xl border ${
                  isDark 
                    ? 'glass-dark border-gray-700' 
                    : 'glass border-white/20'
                } backdrop-blur-xl`}
                hoverEffect="lift"
                delay={100}
              >
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleTabChange('menu')}
                    className="p-4 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary"
                  >
                    <UtensilsCrossed className="h-6 w-6 mb-2 animate-float" />
                    <span className="text-sm font-medium">Manage Menu</span>
                  </button>
                  <button
                    onClick={() => handleTabChange('inventory')}
                    className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Package className="h-6 w-6 mb-2 animate-float" style={{ animationDelay: '1s' }} />
                    <span className="text-sm font-medium">Check Inventory</span>
                  </button>
                  <button
                    onClick={() => handleTabChange('reservations')}
                    className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Calendar className="h-6 w-6 mb-2 animate-float" style={{ animationDelay: '2s' }} />
                    <span className="text-sm font-medium">Reservations</span>
                  </button>
                  <button
                    onClick={() => handleTabChange('collections')}
                    className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <CreditCard className="h-6 w-6 mb-2 animate-float" style={{ animationDelay: '3s' }} />
                    <span className="text-sm font-medium">Collections</span>
                  </button>
                  <button
                    onClick={() => handleTabChange('analytics')}
                    className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <TrendingUp className="h-6 w-6 mb-2 animate-float" style={{ animationDelay: '4s' }} />
                    <span className="text-sm font-medium">View Analytics</span>
                  </button>
                </div>
              </AnimatedCard>

              <AnimatedCard 
                className={`p-6 rounded-xl border ${
                  isDark 
                    ? 'glass-dark border-gray-700' 
                    : 'glass border-white/20'
                } backdrop-blur-xl`}
                hoverEffect="glow"
                delay={200}
              >
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 animate-slide-in-left">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      New order placed for Table 5
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 animate-slide-in-left" style={{ animationDelay: '100ms' }}>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Inventory alert: Low stock on Chicken
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 animate-slide-in-left" style={{ animationDelay: '200ms' }}>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      New reservation for tomorrow
                    </span>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark ? 'bg-gray-900' : 'animated-bg'
    }`}>
      <Header title="Admin Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 animate-slide-down">
          <nav className={`flex space-x-1 p-1 rounded-xl ${
            isDark ? 'glass-dark' : 'glass'
          } backdrop-blur-xl`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-gs-gold to-gs-light-gold text-white shadow-glow-gold'
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
    </div>
  );
};

export default AdminDashboard;