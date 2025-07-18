import React, { useState } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  Wallet, 
  Plus,
  Minus,
  User,
  MapPin,
  Clock
} from 'lucide-react';

const PaymentProcessing: React.FC = () => {
  const { orders, addPayment, updatePaymentStatus } = useOrder();
  const { isDark } = useTheme();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<{method: string, amount: number}[]>([]);
  const [showSplitPayment, setShowSplitPayment] = useState(false);

  const completedOrders = orders.filter(order => 
    order.status === 'completed' && order.paymentStatus !== 'paid'
  );

  const paymentMethodOptions = [
    { id: 'cash', label: 'Cash', icon: DollarSign, color: 'bg-green-500' },
    { id: 'card', label: 'Card', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'upi', label: 'UPI', icon: Smartphone, color: 'bg-purple-500' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'bg-orange-500' },
  ];

  const handlePaymentMethodToggle = (method: string) => {
    if (showSplitPayment) {
      const existingMethod = paymentMethods.find(pm => pm.method === method);
      if (existingMethod) {
        setPaymentMethods(paymentMethods.filter(pm => pm.method !== method));
      } else {
        setPaymentMethods([...paymentMethods, { method, amount: 0 }]);
      }
    } else {
      setPaymentMethods([{ method, amount: selectedOrder?.total || 0 }]);
    }
  };

  const updatePaymentAmount = (method: string, amount: number) => {
    setPaymentMethods(paymentMethods.map(pm => 
      pm.method === method ? { ...pm, amount } : pm
    ));
  };

  const getTotalPaymentAmount = () => {
    return paymentMethods.reduce((sum, pm) => sum + pm.amount, 0);
  };

  const handleProcessPayment = () => {
    if (!selectedOrder || paymentMethods.length === 0) return;

    const totalAmount = getTotalPaymentAmount();
    
    if (totalAmount !== selectedOrder.total) {
      alert('Payment amount does not match order total');
      return;
    }

    // Add payment records
    paymentMethods.forEach(pm => {
      addPayment({
        orderId: selectedOrder.id,
        method: pm.method as any,
        amount: pm.amount
      });
    });

    // Update order payment status
    updatePaymentStatus(selectedOrder.id, 'paid');

    // Reset state
    setSelectedOrder(null);
    setPaymentMethods([]);
    setShowSplitPayment(false);

    // Show success notification
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
      isDark ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
    } border border-green-200`;
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="font-medium">Payment processed successfully! ${selectedOrder.tableNumber ? `Table ${selectedOrder.tableNumber} is now available.` : ''}</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  const getMethodIcon = (methodId: string) => {
    const method = paymentMethodOptions.find(m => m.id === methodId);
    return method ? method.icon : DollarSign;
  };

  const getMethodColor = (methodId: string) => {
    const method = paymentMethodOptions.find(m => m.id === methodId);
    return method ? method.color : 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Payment Processing
          </h2>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Process payments for completed orders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders List */}
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Completed Orders (Pending Payment)
            </h3>
            
            {completedOrders.length === 0 ? (
              <div className={`text-center py-8 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders pending payment</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {completedOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedOrder?.id === order.id
                        ? 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-lg'
                        : isDark 
                          ? 'bg-gray-700 border-gray-600 hover:border-gray-500' 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Order #{order.id.slice(-6)}
                      </h4>
                      <span className={`text-xl font-bold ${
                        selectedOrder?.id === order.id ? 'text-yellow-600' : isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        ₹{order.total.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className={`h-4 w-4 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      {order.tableNumber && (
                        <div className="flex items-center space-x-2">
                          <MapPin className={`h-4 w-4 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            Table {order.tableNumber}
                          </span>
                        </div>
                      )}
                      
                      {order.customerName && (
                        <div className="flex items-center space-x-2">
                          <User className={`h-4 w-4 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            {order.customerName}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {order.items.length} items
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment Processing */}
        <div className={`p-6 rounded-xl border ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-lg`}>
          {selectedOrder ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Process Payment
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Order #{selectedOrder.id.slice(-6)} • Total: ₹{selectedOrder.total.toFixed(2)}
                </p>
              </div>

              {/* Split Payment Toggle */}
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <label className={`text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Split Payment
                    </label>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Allow multiple payment methods
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowSplitPayment(!showSplitPayment);
                      setPaymentMethods([]);
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showSplitPayment ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      showSplitPayment ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className={`text-sm font-medium mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Select Payment Methods
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethodOptions.map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethods.some(pm => pm.method === method.id);
                    
                    return (
                      <button
                        key={method.id}
                        onClick={() => handlePaymentMethodToggle(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                          isSelected
                            ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-lg'
                            : isDark 
                              ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                              : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className={`p-3 rounded-full ${method.color} mx-auto mb-3 transition-transform ${
                          isSelected ? 'scale-110' : ''
                        }`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <p className={`text-sm font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {method.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Amount Inputs */}
              {paymentMethods.length > 0 && (
                <div className="space-y-4">
                  <h4 className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Enter Payment Amounts
                  </h4>
                  {paymentMethods.map((pm, index) => {
                    const Icon = getMethodIcon(pm.method);
                    return (
                      <div key={index} className={`p-4 rounded-lg border ${
                        isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${getMethodColor(pm.method)}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <label className={`block text-xs font-medium mb-1 ${
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {paymentMethodOptions.find(m => m.id === pm.method)?.label} Amount
                            </label>
                            <input
                              type="number"
                              value={pm.amount}
                              onChange={(e) => updatePaymentAmount(pm.method, Number(e.target.value))}
                              className={`w-full px-3 py-2 rounded-lg border text-lg font-semibold ${
                                isDark 
                                  ? 'bg-gray-800 border-gray-600 text-white' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                              placeholder="0.00"
                            />
                          </div>
                          {showSplitPayment && (
                            <button
                              onClick={() => setPaymentMethods(paymentMethods.filter(p => p.method !== pm.method))}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Minus className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className={`p-4 rounded-lg border-2 ${
                    getTotalPaymentAmount() === selectedOrder.total
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Total Payment:
                      </span>
                      <span className={`text-xl font-bold ${
                        getTotalPaymentAmount() === selectedOrder.total
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        ₹{getTotalPaymentAmount().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Order Total:
                      </span>
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        ₹{selectedOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Process Payment Button */}
              <button
                onClick={handleProcessPayment}
                disabled={paymentMethods.length === 0 || getTotalPaymentAmount() !== selectedOrder.total}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  paymentMethods.length === 0 || getTotalPaymentAmount() !== selectedOrder.total
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {paymentMethods.length === 0 
                  ? 'Select Payment Method' 
                  : getTotalPaymentAmount() !== selectedOrder.total
                    ? 'Amount Mismatch'
                    : 'Process Payment'
                }
              </button>
            </div>
          ) : (
            <div className={`text-center py-12 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-8 w-8 opacity-50" />
              </div>
              <p className="text-lg font-medium mb-2">Select an Order</p>
              <p className="text-sm">Choose a completed order to process payment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;