import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useOrder } from '../../contexts/OrderContext';
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Star,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  CheckCircle
} from 'lucide-react';

interface OnlineOrderingProps {
  onClose: () => void;
  menuItems: any[];
}

const OnlineOrdering: React.FC<OnlineOrderingProps> = ({
  onClose,
  menuItems
}) => {
  const { isDark } = useTheme();
  const { currentOrder, addToOrder, removeFromOrder, updateOrderQuantity, clearOrder } = useOrder();
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    instructions: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = [...new Set(menuItems.map(item => item.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');

  const filteredItems = menuItems.filter(item => 
    selectedCategory === '' || item.category === selectedCategory
  );

  const subtotal = currentOrder.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryFee = orderType === 'delivery' ? 50 : 0;
  const tax = (subtotal + deliveryFee) * 0.18;
  const total = subtotal + deliveryFee + tax;

  const getItemQuantity = (menuItemId: string) => {
    const item = currentOrder.find(orderItem => orderItem.menuItemId === menuItemId);
    return item ? item.quantity : 0;
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear the order and show success
      clearOrder();
      setIsSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 4000);
    } catch (error) {
      console.error('Order failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`max-w-md w-full rounded-2xl p-8 text-center ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-2xl animate-scale-in`}>
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Order Placed Successfully!
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Your order is being prepared. You'll receive updates via SMS.
            </p>
          </div>
          
          <div className={`p-4 rounded-xl mb-6 ${
            isDark ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">
                Estimated {orderType === 'delivery' ? 'Delivery' : 'Pickup'}: 25-30 mins
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-6xl w-full h-[90vh] rounded-2xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } shadow-2xl animate-scale-in overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className={`p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Online Ordering
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Order Type Toggle */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() => setOrderType('delivery')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                orderType === 'delivery'
                  ? 'bg-primary text-white'
                  : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Truck className="h-4 w-4" />
              <span>Delivery</span>
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                orderType === 'pickup'
                  ? 'bg-primary text-white'
                  : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Pickup</span>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Menu Section */}
          <div className="flex-1 flex flex-col">
            {/* Category Tabs */}
            <div className={`p-4 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex space-x-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => {
                  const quantity = getItemQuantity(item.id);
                  return (
                    <div key={item.id} className={`rounded-xl border p-4 transition-all duration-200 hover:shadow-lg ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex space-x-4">
                        <img
                          src={item.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=150'}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className={`font-semibold ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {item.name}
                              </h4>
                              <p className={`text-sm mt-1 ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                {item.description}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-primary font-bold">₹{item.price}</span>
                                {item.isSpecial && (
                                  <span className="flex items-center space-x-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                    <Star className="h-3 w-3 fill-current" />
                                    <span>Special</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end mt-3">
                            {quantity > 0 ? (
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => updateOrderQuantity(
                                    currentOrder.find(orderItem => orderItem.menuItemId === item.id)?.id || '',
                                    quantity - 1
                                  )}
                                  className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className={`px-3 py-1 rounded-lg font-semibold ${
                                  isDark ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-900'
                                }`}>
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => addToOrder(item.id, item.name, item.price)}
                                  className="p-1 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToOrder(item.id, item.name, item.price)}
                                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
                              >
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className={`w-80 border-l ${
            isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          } flex flex-col`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className={`text-lg font-semibold flex items-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <ShoppingBag className="h-5 w-5 mr-2" />
                Your Order ({currentOrder.length})
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {currentOrder.length === 0 ? (
                <div className={`text-center py-8 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentOrder.map((item) => (
                    <div key={item.id} className={`p-3 rounded-lg ${
                      isDark ? 'bg-gray-600' : 'bg-white'
                    } border border-gray-200 dark:border-gray-500`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.name}
                          </h4>
                          <p className={`text-sm ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            ₹{item.price} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateOrderQuantity(item.id, item.quantity - 1)}
                            className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className={`px-2 text-sm font-medium ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateOrderQuantity(item.id, item.quantity + 1)}
                            className="p-1 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {currentOrder.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Subtotal:
                    </span>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Delivery Fee:
                      </span>
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        ₹{deliveryFee.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Tax (18%):
                    </span>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 border-gray-200 dark:border-gray-600">
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      Total:
                    </span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-dark text-white transform hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Place Order - ₹{total.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineOrdering;