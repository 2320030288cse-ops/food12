import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useOrder } from '../../contexts/OrderContext';
import { useTheme } from '../../contexts/ThemeContext';
import SmartSearch from './SmartSearch';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  Star, 
  Search,
  User,
  MapPin,
  Mic,
  Zap
} from 'lucide-react';

interface OrderTakingProps {
  rushHourMode?: boolean;
}

const OrderTaking: React.FC<OrderTakingProps> = ({ rushHourMode = false }) => {
  const { menuItems, tables, blockTableForOrder, getPopularItems } = useData();
  const { currentOrder, addToOrder, removeFromOrder, updateOrderQuantity, submitOrder, clearOrder } = useOrder();
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSmartSearch, setShowSmartSearch] = useState(false);

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  const availableTables = tables.filter(table => table.status === 'available');

  let filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  // In rush hour mode, prioritize popular items
  if (rushHourMode && selectedCategory === 'all' && !searchTerm) {
    const popularItems = getPopularItems();
    const otherItems = filteredItems.filter(item => !popularItems.find(p => p.id === item.id));
    filteredItems = [...popularItems, ...otherItems];
  }

  const subtotal = currentOrder.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleSubmitOrder = () => {
    if (currentOrder.length === 0) return;
    
    const orderId = submitOrder(
      tableNumber ? parseInt(tableNumber) : undefined,
      customerName || undefined
    );
    
    setShowOrderModal(false);
    setTableNumber('');
    setCustomerName('');
    
    // Show success message
    // Create a nice success notification
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
      isDark ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
    } border border-green-200`;
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="font-medium">Order #${orderId.slice(-6)} submitted successfully!${tableNumber ? ` Table ${tableNumber} is now occupied.` : ''}</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  const getItemQuantity = (menuItemId: string) => {
    const item = currentOrder.find(orderItem => orderItem.menuItemId === menuItemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${rushHourMode ? 'rush-hour-mode' : ''}`}>
      {/* Menu Items */}
      <div className="lg:col-span-2 space-y-6">
        {/* Rush Hour Banner */}
        {rushHourMode && (
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6" />
              <div>
                <h3 className="font-bold text-lg">Rush Hour Mode Active</h3>
                <p className="text-sm opacity-90">Popular items shown first • Larger buttons • Simplified interface</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 ${rushHourMode ? 'hidden' : ''}`}>
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
            />
          </div>
          <button
            onClick={() => setShowSmartSearch(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Mic className="h-5 w-5" />
            <span>Voice Search</span>
          </button>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Search in Rush Hour */}
        {rushHourMode && (
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 transition-colors ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-4 focus:ring-yellow-500 focus:border-yellow-500`}
            />
            <button
              onClick={() => setShowSmartSearch(true)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Mic className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Menu Grid */}
        <div className={`grid gap-4 ${
          rushHourMode 
            ? 'grid-cols-1 sm:grid-cols-2 gap-6' 
            : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
        }`}>
          {filteredItems.map((item) => {
            const quantity = getItemQuantity(item.id);
            return (
              <div key={item.id} className={`rounded-lg border overflow-hidden transition-all duration-200 hover:shadow-xl ${
                rushHourMode ? 'transform hover:scale-105' : ''
              } ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              } shadow-lg`}>
                <div className="relative">
                  <img
                    src={item.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={item.name}
                    className={`w-full object-cover ${rushHourMode ? 'h-40' : 'h-32'}`}
                  />
                  {item.isSpecial && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Special</span>
                    </div>
                  )}
                  {rushHourMode && getPopularItems().find(p => p.id === item.id) && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Popular
                    </div>
                  )}
                </div>
                
                <div className={`p-4 ${rushHourMode ? 'p-6' : ''}`}>
                  <h3 className={`font-semibold mb-1 ${rushHourMode ? 'text-xl' : ''} ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.name}
                  </h3>
                  <p className={`text-sm mb-2 ${rushHourMode ? 'text-base' : ''} ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${rushHourMode ? 'text-2xl' : 'text-lg'} ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      ₹{item.price}
                    </span>
                    
                    {quantity > 0 ? (
                      <div className={`flex items-center space-x-2 ${rushHourMode ? 'space-x-3' : ''}`}>
                        <button
                          onClick={() => updateOrderQuantity(
                            currentOrder.find(orderItem => orderItem.menuItemId === item.id)?.id || '',
                            quantity - 1
                          )}
                          className={`bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors ${
                            rushHourMode ? 'p-3' : 'p-1'
                          }`}
                        >
                          <Minus className={`${rushHourMode ? 'h-6 w-6' : 'h-4 w-4'}`} />
                        </button>
                        <span className={`px-2 py-1 font-bold ${rushHourMode ? 'text-xl px-4 py-2' : ''} ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => addToOrder(item.id, item.name, item.price)}
                          className={`bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors ${
                            rushHourMode ? 'p-3' : 'p-1'
                          }`}
                        >
                          <Plus className={`${rushHourMode ? 'h-6 w-6' : 'h-4 w-4'}`} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToOrder(item.id, item.name, item.price)}
                        className={`bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors ${
                          rushHourMode ? 'p-4' : 'p-2'
                        }`}
                      >
                        <Plus className={`${rushHourMode ? 'h-6 w-6' : 'h-5 w-5'}`} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className={`sticky top-24 rounded-lg border p-6 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <ShoppingCart className="h-5 w-5 mr-2" />
            Current Order ({currentOrder.length})
          </h3>
          
          {currentOrder.length === 0 ? (
            <p className={`text-center py-8 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No items in order
            </p>
          ) : (
            <>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {currentOrder.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className={`font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.name}
                      </p>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
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
                      <span className={`px-2 text-sm ${
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
                ))}
              </div>
              
              <div className={`border-t pt-4 space-y-2 ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
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
                <div className="flex justify-between text-lg font-bold">
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>
                    Total:
                  </span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setShowOrderModal(true)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Place Order
                </button>
                <button
                  onClick={clearOrder}
                  className={`w-full border font-semibold py-3 rounded-lg transition-colors ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Clear Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-lg p-6 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Order Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Table Number (Optional)
                </label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                >
                  <option value="">Select a table</option>
                  {availableTables.map(table => (
                    <option key={table.id} value={table.number}>
                      Table {table.number} ({table.capacity} seats) - Available
                    </option>
                  ))}
                </select>
                {availableTables.length === 0 && (
                  <p className={`text-sm mt-2 ${
                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    All tables are currently occupied or reserved
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <User className="h-4 w-4 inline mr-1" />
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className={`w-full px-3 py-3 rounded-lg border transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-primary focus:border-transparent`}
                />
              </div>

              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Order Summary:
                </p>
                <div className="space-y-1">
                  {currentOrder.map((item) => (
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
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowOrderModal(false)}
                className={`px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitOrder}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                Submit Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Search Modal */}
      {showSmartSearch && (
        <SmartSearch
          onClose={() => setShowSmartSearch(false)}
          onAddToOrder={addToOrder}
          tables={availableTables}
        />
      )}
    </div>
  );
};

export default OrderTaking;