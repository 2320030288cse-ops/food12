import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useOrder } from '../../contexts/OrderContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  Star, 
  Search,
  ChefHat,
  Moon,
  Sun,
  Send
} from 'lucide-react';

interface CustomerMenuProps {
  tableId: string;
}

const CustomerMenu: React.FC<CustomerMenuProps> = ({ tableId }) => {
  const { menuItems, tables, addFeedback } = useData();
  const { currentOrder, addToOrder, removeFromOrder, updateOrderQuantity, submitOrder, clearOrder } = useOrder();
  const { isDark, toggleTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({
    foodRating: 5,
    serviceRating: 5,
    cleanlinessRating: 5,
    comment: ''
  });

  const table = tables.find(t => t.id === tableId);
  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  const specialItems = menuItems.filter(item => item.isSpecial && item.available);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  const subtotal = currentOrder.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleSubmitOrder = () => {
    if (currentOrder.length === 0) return;
    
    const orderId = submitOrder(
      table?.number,
      customerName || 'QR Order Customer'
    );
    
    setShowOrderModal(false);
    setCustomerName('');
    
    // Show success message and offer feedback
    alert(`Order ${orderId} submitted successfully!`);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = () => {
    addFeedback({
      orderId: 'qr-order-' + Date.now(),
      ...feedback,
      date: new Date()
    });
    
    setShowFeedbackModal(false);
    setFeedback({
      foodRating: 5,
      serviceRating: 5,
      cleanlinessRating: 5,
      comment: ''
    });
    
    alert('Thank you for your feedback!');
  };

  const getItemQuantity = (menuItemId: string) => {
    const item = currentOrder.find(orderItem => orderItem.menuItemId === menuItemId);
    return item ? item.quantity : 0;
  };

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange(star)}
            className={`${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400 transition-colors`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b transition-colors ${
        isDark 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white/80 backdrop-blur-md border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <h1 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  GS Restaurant
                </h1>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {table ? `Table ${table.number}` : 'QR Menu'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'hover:bg-gray-800 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowOrderModal(true)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'hover:bg-gray-800 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
                {currentOrder.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {currentOrder.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Special Items Banner */}
        {specialItems.length > 0 && (
          <div className={`mb-8 p-6 rounded-xl ${
            isDark 
              ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-800' 
              : 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200'
          }`}>
            <div className="flex items-center mb-4">
              <Star className="h-6 w-6 text-yellow-500 fill-current mr-2" />
              <h2 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Today's Specials
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {specialItems.slice(0, 3).map((item) => (
                <div key={item.id} className={`p-4 rounded-lg ${
                  isDark 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                } shadow-sm`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.name}
                      </h3>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {item.description}
                      </p>
                      <p className={`text-lg font-bold mt-1 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        ₹{item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => addToOrder(item.id, item.name, item.price)}
                      className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 py-3 rounded-lg border transition-colors ${
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

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const quantity = getItemQuantity(item.id);
            return (
              <div key={item.id} className={`rounded-xl border overflow-hidden transition-colors ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              } shadow-lg hover:shadow-xl transition-shadow`}>
                <div className="relative">
                  <img
                    src={item.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  {item.isSpecial && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Special</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className={`font-semibold text-lg mb-1 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.name}
                  </h3>
                  <p className={`text-sm mb-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.description}
                  </p>
                  <p className={`text-sm font-medium mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {item.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      ₹{item.price}
                    </span>
                    
                    {quantity > 0 ? (
                      <div className="flex items-center space-x-2">
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
                          isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
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
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Modal */}
        {showOrderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`max-w-md w-full rounded-xl p-6 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } max-h-[90vh] overflow-y-auto`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Your Order
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className={`p-2 rounded-lg ${
                    isDark 
                      ? 'hover:bg-gray-700 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  ×
                </button>
              </div>
              
              {currentOrder.length === 0 ? (
                <p className={`text-center py-8 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Your order is empty
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
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

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your name"
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={clearOrder}
                        className={`flex-1 border font-semibold py-3 rounded-lg transition-colors ${
                          isDark 
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Clear Order
                      </button>
                      <button
                        onClick={handleSubmitOrder}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <Send className="h-5 w-5" />
                        <span>Place Order</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`max-w-md w-full rounded-xl p-6 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                We'd love your feedback!
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Food Quality
                  </label>
                  <StarRating 
                    rating={feedback.foodRating} 
                    onRatingChange={(rating) => setFeedback({...feedback, foodRating: rating})}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Service
                  </label>
                  <StarRating 
                    rating={feedback.serviceRating} 
                    onRatingChange={(rating) => setFeedback({...feedback, serviceRating: rating})}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Cleanliness
                  </label>
                  <StarRating 
                    rating={feedback.cleanlinessRating} 
                    onRatingChange={(rating) => setFeedback({...feedback, cleanlinessRating: rating})}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Comments (Optional)
                  </label>
                  <textarea
                    value={feedback.comment}
                    onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                    placeholder="Tell us about your experience..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className={`flex-1 border font-semibold py-3 rounded-lg transition-colors ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Skip
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerMenu;