import React, { useState } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  MapPin, 
  ShoppingCart,
  Filter
} from 'lucide-react';

const OrderManagement: React.FC = () => {
  const { orders, updateOrderStatus } = useOrder();
  const { isDark } = useTheme();
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = orders.filter(order => {
    return filterStatus === 'all' || order.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'preparing': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'ready': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'completed': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'cancelled': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusActions = (order: any) => {
    switch (order.status) {
      case 'pending':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => updateOrderStatus(order.id, 'preparing')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
            >
              Start Preparing
            </button>
            <button
              onClick={() => updateOrderStatus(order.id, 'cancelled')}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        );
      case 'preparing':
        return (
          <button
            onClick={() => updateOrderStatus(order.id, 'ready')}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
          >
            Mark Ready
          </button>
        );
      case 'ready':
        return (
          <button
            onClick={() => updateOrderStatus(order.id, 'completed')}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors"
          >
            Mark Completed
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Order Management
        </h2>
        
        <div className="flex items-center space-x-2">
          <Filter className={`h-5 w-5 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className={`text-center py-12 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No orders found</p>
          </div>
        ) : (
          filteredOrders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((order) => (
              <div key={order.id} className={`rounded-lg border p-6 transition-colors ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              } shadow-lg`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      <h3 className={`text-lg font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Order #{order.id.slice(-6)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getStatusColor(order.status)
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Clock className={`h-4 w-4 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      {order.tableNumber && (
                        <div className="flex items-center space-x-2">
                          <MapPin className={`h-4 w-4 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            Table {order.tableNumber}
                          </span>
                        </div>
                      )}
                      
                      {order.customerName && (
                        <div className="flex items-center space-x-2">
                          <User className={`h-4 w-4 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {order.customerName}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className={`p-4 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <p className={`text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Order Items:
                      </p>
                      <div className="space-y-1">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                              {item.name} x {item.quantity}
                            </span>
                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                              ₹{item.subtotal}
                            </span>
                          </div>
                        ))}
                        <div className={`border-t pt-2 mt-2 ${
                          isDark ? 'border-gray-600' : 'border-gray-300'
                        }`}>
                          <div className="flex justify-between font-semibold">
                            <span className={isDark ? 'text-white' : 'text-gray-900'}>
                              Total:
                            </span>
                            <span className={isDark ? 'text-white' : 'text-gray-900'}>
                              ₹{order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {getStatusActions(order)}
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default OrderManagement;