import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, Edit, AlertTriangle, Package } from 'lucide-react';

const InventoryManagement: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryItem } = useData();
  const { isDark } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: '',
    minQuantity: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
      ...formData,
      quantity: Number(formData.quantity),
      minQuantity: Number(formData.minQuantity)
    };

    if (editingItem) {
      updateInventoryItem(editingItem, itemData);
    } else {
      addInventoryItem(itemData);
    }

    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      quantity: '',
      unit: '',
      minQuantity: ''
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item.id);
    setFormData({
      name: item.name,
      quantity: item.quantity.toString(),
      unit: item.unit,
      minQuantity: item.minQuantity.toString()
    });
    setIsModalOpen(true);
  };

  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Inventory Management
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800 dark:text-red-200">
              Low Stock Alert
            </h3>
          </div>
          <p className="text-red-700 dark:text-red-300 text-sm">
            {lowStockItems.length} item(s) are running low on stock: {lowStockItems.map(item => item.name).join(', ')}
          </p>
        </div>
      )}

      {/* Inventory Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {inventory.map((item) => (
          <div key={item.id} className={`rounded-lg border p-6 transition-colors ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <Package className={`h-8 w-8 ${
                item.quantity <= item.minQuantity ? 'text-red-500' : 'text-green-500'
              }`} />
              <button
                onClick={() => handleEdit(item)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
            
            <h3 className={`font-semibold text-lg mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {item.name}
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Current Stock:
                </span>
                <span className={`font-semibold ${
                  item.quantity <= item.minQuantity 
                    ? 'text-red-500' 
                    : isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.quantity} {item.unit}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Min. Required:
                </span>
                <span className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.minQuantity} {item.unit}
                </span>
              </div>
            </div>
            
            {/* Stock Status Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Stock Level
                </span>
                <span className={`text-xs ${
                  item.quantity <= item.minQuantity ? 'text-red-500' : 'text-green-500'
                }`}>
                  {item.quantity <= item.minQuantity ? 'Low' : 'Good'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    item.quantity <= item.minQuantity 
                      ? 'bg-red-500' 
                      : item.quantity <= item.minQuantity * 2 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${Math.min((item.quantity / (item.minQuantity * 3)) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-lg p-6 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  placeholder="e.g., kg, liters, pieces"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Minimum Quantity
                </label>
                <input
                  type="number"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({...formData, minQuantity: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                    setFormData({
                      name: '',
                      quantity: '',
                      unit: '',
                      minQuantity: ''
                    });
                  }}
                  className={`px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;