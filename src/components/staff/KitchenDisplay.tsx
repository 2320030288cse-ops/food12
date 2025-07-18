import React, { useState, useEffect } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Clock, 
  ChefHat, 
  CheckCircle, 
  AlertCircle,
  Timer,
  User,
  MapPin,
  Bell
} from 'lucide-react';

const KitchenDisplay: React.FC = () => {
  const { orders, updateOrderStatus } = useOrder();
  const { updateTableOrderStatus } = useData();
  const { isDark } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'preparing'
  );

  const getOrderDuration = (createdAt: Date) => {
    const now = currentTime.getTime();
    const created = new Date(createdAt).getTime();
    const diffMinutes = Math.floor((now - created) / (1000 * 60));
    return diffMinutes;
  };

  const getOrderPriority = (createdAt: Date) => {
    const duration = getOrderDuration(createdAt);
    if (duration > 30) return 'high';
    if (duration > 15) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    }
  };

  const handleStartPreparing = (orderId: string, tableNumber?: number) => {
    updateOrderStatus(orderId, 'preparing');
    if (tableNumber) {
      updateTableOrderStatus(`table-${tableNumber}`, 'preparing');
    }
    
    // Play notification sound
    playNotificationSound();
  };

  const handleMarkReady = (orderId: string, tableNumber?: number) => {
    updateOrderStatus(orderId, 'ready');
    if (tableNumber) {
      updateTableOrderStatus(`table-${tableNumber}`, 'served');
    }
    
    // Send notification to staff
    sendStaffNotification(orderId, tableNumber);
    playNotificationSound();
  };

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const sendStaffNotification = (orderId: string, tableNumber?: number) => {
    // In a real app, this would send a push notification or websocket message
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
      isDark ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
    } border border-green-200`;
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="font-medium">Order #${orderId.slice(-6)} is ready! ${tableNumber ? `Table ${tableNumber}` : ''}</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Kitchen Display System
            </h2>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Real-time order management for kitchen staff
            </p>
          </div>
        </div>
        
        <div className={`text-right ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <div className="text-2xl font-bold">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-sm">
            {currentTime.toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {orders.filter(o => o.status === 'pending').length}
              </p>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Pending
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {orders.filter(o => o.status === 'preparing').length}
              </p>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Preparing
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {orders.filter(o => o.status === 'ready').length}
              </p>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Ready
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {activeOrders.filter(o => getOrderPriority(o.createdAt) === 'high').length}
              </p>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Urgent
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Orders */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Active Orders ({activeOrders.length})
        </h3>
        
        {activeOrders.length === 0 ? (
          <div className={`text-center py-12 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Active Orders</p>
            <p className="text-sm">All caught up! New orders will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .map((order) => {
                const duration = getOrderDuration(order.createdAt);
                const priority = getOrderPriority(order.createdAt);
                
                return (
                  <div key={order.id} className={`rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                    getPriorityColor(priority)
                  } ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <h4 className={`text-lg font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          #{order.id.slice(-6)}
                        </h4>
                        {priority === 'high' && (
                          <div className="flex items-center space-x-1 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">URGENT</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Timer className={`h-4 w-4 ${
                          priority === 'high' ? 'text-red-600' : 
                          priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`} />
                        <span className={`text-sm font-medium ${
                          priority === 'high' ? 'text-red-600' : 
                          priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {duration}m
                        </span>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className={`h-4 w-4 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {new Date(order.createdAt).toLocaleTimeString()}
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

                    {/* Order Items */}
                    <div className={`p-3 rounded-lg mb-4 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className="space-y-2">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <div>
                              <span className={`font-medium ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {item.name}
                              </span>
                              <span className={`ml-2 text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                x{item.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {order.status === 'pending' ? (
                        <button
                          onClick={() => handleStartPreparing(order.id, order.tableNumber)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <ChefHat className="h-5 w-5" />
                          <span>Start Preparing</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkReady(order.id, order.tableNumber)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="h-5 w-5" />
                          <span>Mark Ready</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;