import React from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import StatsCard from '../common/StatsCard';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Clock,
  Star,
  Users,
  Download
} from 'lucide-react';

const Analytics: React.FC = () => {
  const { orders, getTotalRevenue } = useOrder();
  const { feedback, menuItems } = useData();
  const { isDark } = useTheme();

  const completedOrders = orders.filter(order => order.status === 'completed');
  const totalRevenue = getTotalRevenue();
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  // Calculate completion times
  const completionTimes = completedOrders
    .filter(order => order.completedAt)
    .map(order => {
      const created = new Date(order.createdAt).getTime();
      const completed = new Date(order.completedAt!).getTime();
      return (completed - created) / (1000 * 60); // minutes
    });

  const avgCompletionTime = completionTimes.length > 0 
    ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length 
    : 0;

  const minCompletionTime = completionTimes.length > 0 ? Math.min(...completionTimes) : 0;
  const maxCompletionTime = completionTimes.length > 0 ? Math.max(...completionTimes) : 0;

  // Best-selling dishes
  const itemSales = orders
    .filter(order => order.status === 'completed')
    .flatMap(order => order.items)
    .reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

  const bestSellingDishes = Object.entries(itemSales)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Average ratings
  const avgRatings = {
    food: feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.foodRating, 0) / feedback.length : 0,
    service: feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.serviceRating, 0) / feedback.length : 0,
    cleanliness: feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.cleanlinessRating, 0) / feedback.length : 0,
  };

  const handleExportPDF = () => {
    // Simple PDF export simulation
    const reportData = {
      totalRevenue,
      totalOrders: orders.length,
      avgOrderValue,
      avgCompletionTime,
      bestSellingDishes,
      avgRatings,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gs-restaurant-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Analytics & Reports
        </h2>
        <button
          onClick={handleExportPDF}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-green-500"
          change="+12%"
        />
        <StatsCard
          title="Total Orders"
          value={orders.length}
          icon={<ShoppingCart className="h-6 w-6 text-white" />}
          color="bg-blue-500"
          change="+8%"
        />
        <StatsCard
          title="Avg Order Value"
          value={`₹${avgOrderValue.toFixed(0)}`}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-purple-500"
          change="+5%"
        />
        <StatsCard
          title="Avg Completion Time"
          value={`${avgCompletionTime.toFixed(1)} min`}
          icon={<Clock className="h-6 w-6 text-white" />}
          color="bg-orange-500"
          change="-2%"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Statistics */}
        <div className={`rounded-lg border p-6 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Order Statistics
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Min Completion Time:
              </span>
              <span className={`font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {minCompletionTime.toFixed(1)} min
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Max Completion Time:
              </span>
              <span className={`font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {maxCompletionTime.toFixed(1)} min
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Completed Orders:
              </span>
              <span className={`font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {completedOrders.length}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Success Rate:
              </span>
              <span className={`font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {orders.length > 0 ? ((completedOrders.length / orders.length) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Customer Feedback */}
        <div className={`rounded-lg border p-6 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Customer Feedback
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Food Quality:
              </span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(avgRatings.food) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {avgRatings.food.toFixed(1)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Service:
              </span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(avgRatings.service) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {avgRatings.service.toFixed(1)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Cleanliness:
              </span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(avgRatings.cleanliness) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {avgRatings.cleanliness.toFixed(1)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total Reviews:
              </span>
              <span className={`font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {feedback.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling Dishes */}
      <div className={`rounded-lg border p-6 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Best Selling Dishes
        </h3>
        
        <div className="space-y-3">
          {bestSellingDishes.length > 0 ? (
            bestSellingDishes.map(([dishName, quantity], index) => (
              <div key={dishName} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {dishName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {quantity} sold
                  </span>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((quantity / Math.max(...bestSellingDishes.map(([,q]) => q))) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={`text-center ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No sales data available yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;