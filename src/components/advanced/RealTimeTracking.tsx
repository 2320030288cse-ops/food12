import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { DatabaseService } from '../../services/DatabaseService';
import ProgressBar from '../common/ProgressBar';
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  ChefHat,
  Bell,
  User,
  Phone
} from 'lucide-react';

interface OrderTracking {
  orderId: string;
  orderNumber: string;
  customerName?: string;
  customerPhone?: string;
  tableNumber?: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed';
  estimatedTime: number;
  actualTime?: number;
  items: Array<{
    name: string;
    quantity: number;
    status: 'pending' | 'preparing' | 'ready' | 'served';
  }>;
  timeline: Array<{
    status: string;
    timestamp: Date;
    note?: string;
  }>;
}

const RealTimeTracking: React.FC = () => {
  const { isDark } = useTheme();
  const [activeOrders, setActiveOrders] = useState<OrderTracking[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const dbService = DatabaseService.getInstance();

  useEffect(() => {
    loadActiveOrders();
    
    // Set up real-time updates
    const interval = setInterval(loadActiveOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadActiveOrders = async () => {
    try {
      const orders = await dbService.getOrders();
      const activeOrdersData = orders
        .filter(order => !['completed', 'cancelled'].includes(order.status))
        .map(order => ({
          orderId: order.id,
          orderNumber: order.order_number,
          customerName: order.customers?.name,
          customerPhone: order.customers?.phone,
          tableNumber: order.tables?.table_number,
          status: order.status as any,
          estimatedTime: order.estimated_time || 30,
          items: order.order_items?.map((item: any) => ({
            name: item.menu_items?.name || 'Unknown Item',
            quantity: item.quantity,
            status: item.status
          })) || [],
          timeline: [
            { status: 'Order Placed', timestamp: new Date(order.created_at) },
            ...(order.status !== 'pending' ? [{ status: 'Confirmed', timestamp: new Date(order.updated_at) }] : []),
            ...(order.status === 'preparing' || order.status === 'ready' || order.status === 'served' ? 
              [{ status: 'Preparing', timestamp: new Date(order.updated_at) }] : []),
            ...(order.status === 'ready' || order.status === 'served' ? 
              [{ status: 'Ready', timestamp: new Date(order.updated_at) }] : []),
            ...(order.status === 'served' ? 
              [{ status: 'Served', timestamp: new Date(order.updated_at) }] : [])
          ]
        }));
      
      setActiveOrders(activeOrdersData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading active orders:', error);
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'served': return 4;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'confirmed': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'preparing': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'ready': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'served': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getEstimatedDeliveryTime = (order: OrderTracking) => {
    const orderTime = new Date(order.timeline[0].timestamp);
    const estimatedDelivery = new Date(orderTime.getTime() + order.estimatedTime * 60000);
    return estimatedDelivery;
  };

  const sendNotification = async (orderId: string, message: string) => {
    try {
      await dbService.createNotification({
        title: 'Order Update',
        message,
        type: 'info'
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className={`ml-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Loading orders...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
          <MapPin className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Real-Time Order Tracking
          </h2>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Live updates on all active orders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {activeOrders.length === 0 ? (
            <div className={`text-center py-12 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No Active Orders</p>
              <p className="text-sm">All orders have been completed</p>
            </div>
          ) : (
            activeOrders.map((order) => (
              <div
                key={order.orderId}
                onClick={() => setSelectedOrder(order)}
                className={`p-6 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedOrder?.orderId === order.orderId
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : isDark 
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className={`text-lg font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Order #{order.orderNumber}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getStatusColor(order.status)
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      ETA: {getEstimatedDeliveryTime(order).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <ProgressBar
                    currentStep={getStatusStep(order.status)}
                    steps={['Received', 'Confirmed', 'Preparing', 'Ready', 'Served']}
                    animated={true}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {order.customerName && (
                    <div className="flex items-center space-x-2">
                      <User className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {order.customerName}
                      </span>
                    </div>
                  )}
                  
                  {order.tableNumber && (
                    <div className="flex items-center space-x-2">
                      <MapPin className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        Table {order.tableNumber}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Clock className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {order.estimatedTime} min
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <ChefHat className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {order.items.length} items
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Details Panel */}
        <div className="lg:col-span-1">
          <div className={`sticky top-6 rounded-xl border p-6 ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-lg`}>
            {selectedOrder ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Order #{selectedOrder.orderNumber}
                  </h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    getStatusColor(selectedOrder.status)
                  }`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className={`font-semibold mb-3 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Order Items
                    </h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${
                          isDark ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getStatusColor(item.status)
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-3 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Timeline
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.timeline.map((event, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === selectedOrder.timeline.length - 1 
                              ? 'bg-primary animate-pulse' 
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}></div>
                          <div className="flex-1">
                            <div className={`font-medium ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              {event.status}
                            </div>
                            <div className={`text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {event.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedOrder.customerPhone && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => sendNotification(selectedOrder.orderId, `Order ${selectedOrder.orderNumber} update sent`)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                      >
                        <Bell className="h-5 w-5" />
                        <span>Send Update</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`text-center py-12 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Select an Order</p>
                <p className="text-sm">Click on any order to view detailed tracking information</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTracking;