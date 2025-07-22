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

    // Show phone number modal for SMS
    setShowPhoneModal(true);
    setSmsMessage(`Thank you for dining at GS Restaurant! Your payment of ₹${totalAmount.toFixed(2)} has been processed successfully. Order #${selectedOrder.id.slice(-6)}. We hope you enjoyed your meal!`);
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

      {/* Phone Number & SMS Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-xl p-6 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl animate-scale-in`}>
            <div className="text-center mb-6">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Send Receipt via SMS
              </h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Payment successful! Would you like to send a receipt to the customer?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Customer Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className={`w-full px-4 py-3 rounded-lg border text-lg ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-primary focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  SMS Message Preview
                </label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-primary focus:border-transparent`}
                />
              </div>

              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex justify-between items-center text-sm">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Order Total:
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ₹{selectedOrder?.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSkipSMS}
                disabled={sendingSMS}
                className={`flex-1 px-4 py-3 rounded-lg border font-semibold transition-colors ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${sendingSMS ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Skip SMS
              </button>
              <button
                onClick={handleSendSMS}
                disabled={!customerPhone.trim() || sendingSMS}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  !customerPhone.trim() || sendingSMS
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {sendingSMS ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send SMS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessing;