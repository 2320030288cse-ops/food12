import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Download,
  CreditCard,
  Smartphone,
  Wallet,
  Filter,
  BarChart3
} from 'lucide-react';

const DailyCollections: React.FC = () => {
  const { dailyCollections, getDailyCollections } = useData();
  const { isDark } = useTheme();
  const [collections, setCollections] = useState(dailyCollections);
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    setLoading(true);
    try {
      const data = await getDailyCollections();
      setCollections(data);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCollections = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    switch (dateFilter) {
      case 'today':
        return collections.filter(c => c.date === today);
      case 'yesterday':
        return collections.filter(c => c.date === yesterday);
      case 'week':
        return collections.filter(c => c.date >= weekAgo);
      case 'month':
        return collections.filter(c => c.date >= monthAgo);
      default:
        return collections;
    }
  };

  const filteredCollections = getFilteredCollections();
  const totalAmount = filteredCollections.reduce((sum, c) => sum + c.total_amount, 0);
  const totalOrders = filteredCollections.reduce((sum, c) => sum + c.total_orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'upi': return <Smartphone className="h-4 w-4" />;
      case 'wallet': return <Wallet className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'card': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'upi': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'wallet': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      default: return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Total Amount', 'Total Orders', 'Avg Order Value', 'Cash', 'Card', 'UPI', 'Wallet'],
      ...filteredCollections.map(c => [
        c.date,
        c.total_amount.toFixed(2),
        c.total_orders.toString(),
        (c.total_amount / c.total_orders).toFixed(2),
        (c.payment_methods.cash || 0).toFixed(2),
        (c.payment_methods.card || 0).toFixed(2),
        (c.payment_methods.upi || 0).toFixed(2),
        (c.payment_methods.wallet || 0).toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gs-restaurant-collections-${dateFilter}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Daily Collections
            </h2>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Track daily revenue and payment methods
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className={`h-5 w-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Total Revenue
              </p>
              <p className={`text-2xl font-bold mt-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                ₹{totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
              <DollarSign className="h-6 w-6 text-white" />
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
                {totalOrders}
              </p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
              <Calendar className="h-6 w-6 text-white" />
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
                Avg Order Value
              </p>
              <p className={`text-2xl font-bold mt-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                ₹{avgOrderValue.toFixed(0)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Collections Table */}
      <div className={`rounded-xl border ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } shadow-lg overflow-hidden`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Daily Collections Report
          </h3>
        </div>

        {loading ? (
          <div className={`p-12 text-center ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Loading collections...</p>
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className={`p-12 text-center ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Collections Found</p>
            <p className="text-sm">No data available for the selected period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Date
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Total Amount
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Orders
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Avg Value
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Payment Methods
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {filteredCollections.map((collection) => (
                  <tr key={collection.id} className={`hover:${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  } transition-colors`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {new Date(collection.date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`}>
                      ₹{collection.total_amount.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {collection.total_orders}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      ₹{(collection.total_amount / collection.total_orders).toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(collection.payment_methods).map(([method, amount]) => (
                          amount > 0 && (
                            <div key={method} className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                              getPaymentMethodColor(method)
                            }`}>
                              {getPaymentMethodIcon(method)}
                              <span>{method.toUpperCase()}</span>
                              <span>₹{amount.toFixed(0)}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyCollections;