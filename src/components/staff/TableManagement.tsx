import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useOrder } from '../../contexts/OrderContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Users, Clock, DollarSign, Plus, Edit, RotateCcw, Square, Circle, RectangleVertical as Rectangle } from 'lucide-react';

const TableManagement: React.FC = () => {
  const { tables, updateTablePosition, updateTableStatus, updateTableOrderStatus } = useData();
  const { orders } = useOrder();
  const { isDark } = useTheme();
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showTableDetails, setShowTableDetails] = useState(false);
  const floorPlanRef = useRef<HTMLDivElement>(null);

  const getTableStatusColor = (table: any) => {
    if (table.status === 'available') return 'bg-green-500';
    
    switch (table.orderStatus) {
      case 'waiting': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'served': return 'bg-orange-500';
      case 'billing': return 'bg-red-500';
      default: return table.status === 'occupied' ? 'bg-red-500' : 'bg-green-500';
    }
  };

  const getTableStatusText = (table: any) => {
    if (table.status === 'available') return 'Available';
    
    switch (table.orderStatus) {
      case 'waiting': return 'Order Placed';
      case 'preparing': return 'Preparing';
      case 'served': return 'Dining';
      case 'billing': return 'Awaiting Payment';
      default: return table.status === 'occupied' ? 'Occupied' : 'Available';
    }
  };

  const handleTableDragStart = (e: React.DragEvent, tableId: string) => {
    setDraggedTable(tableId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTableDragEnd = () => {
    setDraggedTable(null);
  };

  const handleFloorPlanDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTable || !floorPlanRef.current) return;

    const rect = floorPlanRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    updateTablePosition(draggedTable, { x, y });
    setDraggedTable(null);
  };

  const handleFloorPlanDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleTableClick = (tableId: string) => {
    setSelectedTable(tableId);
    setShowTableDetails(true);
  };

  const getTableOrder = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (!table?.currentOrderId) return null;
    return orders.find(o => o.id === table.currentOrderId);
  };

  const updateOrderStatus = (tableId: string, status: any) => {
    updateTableOrderStatus(tableId, status);
  };

  const selectedTableData = selectedTable ? tables.find(t => t.id === selectedTable) : null;
  const selectedTableOrder = selectedTable ? getTableOrder(selectedTable) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Interactive Table Management
          </h2>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Drag tables to rearrange • Click tables for details • Real-time status updates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Floor Plan */}
        <div className="lg:col-span-3">
          <div className={`rounded-xl border-2 border-dashed p-6 min-h-[600px] relative ${
            isDark 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-gray-50 border-gray-300'
          }`}>
            <div className="absolute top-4 left-4">
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Restaurant Floor Plan
              </h3>
            </div>

            <div
              ref={floorPlanRef}
              className="w-full h-full relative"
              onDrop={handleFloorPlanDrop}
              onDragOver={handleFloorPlanDragOver}
            >
              {tables.map((table) => {
                const statusColor = getTableStatusColor(table);
                const TableShape = table.shape === 'round' ? Circle : 
                                 table.shape === 'square' ? Square : Rectangle;
                
                return (
                  <div
                    key={table.id}
                    draggable
                    onDragStart={(e) => handleTableDragStart(e, table.id)}
                    onDragEnd={handleTableDragEnd}
                    onClick={() => handleTableClick(table.id)}
                    className={`absolute cursor-move transform transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                      draggedTable === table.id ? 'opacity-50 scale-110' : ''
                    } ${
                      selectedTable === table.id ? 'ring-4 ring-blue-500' : ''
                    }`}
                    style={{
                      left: table.position?.x || 100,
                      top: table.position?.y || 100,
                    }}
                  >
                    <div className={`relative p-4 rounded-xl ${statusColor} text-white shadow-lg min-w-[80px] min-h-[80px] flex flex-col items-center justify-center`}>
                      <TableShape className="h-6 w-6 mb-1" />
                      <span className="font-bold text-lg">T{table.number}</span>
                      <span className="text-xs opacity-90">{table.capacity} seats</span>
                      
                      {table.status === 'occupied' && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className={`mt-1 text-center text-xs font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {getTableStatusText(table)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4">
              <div className={`p-3 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-white'
              } shadow-lg`}>
                <h4 className={`text-sm font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Status Legend
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Order Placed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Preparing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Dining</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Awaiting Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Details Panel */}
        <div className="lg:col-span-1">
          <div className={`rounded-xl border p-6 sticky top-6 ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } shadow-lg`}>
            {selectedTableData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Table {selectedTableData.number}
                  </h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedTableData.status === 'available' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                  }`}>
                    {getTableStatusText(selectedTableData)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className={`h-4 w-4 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Capacity: {selectedTableData.capacity} people
                    </span>
                  </div>

                  {selectedTableData.reservedBy && (
                    <div className="flex items-center space-x-2">
                      <Clock className={`h-4 w-4 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {selectedTableData.reservedBy}
                      </span>
                    </div>
                  )}
                </div>

                {selectedTableOrder && (
                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h4 className={`font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Current Order
                    </h4>
                    <div className="space-y-2">
                      {selectedTableOrder.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
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
                            ₹{selectedTableOrder.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTableData.status === 'occupied' && (
                  <div className="space-y-2">
                    <h4 className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Update Status
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateOrderStatus(selectedTableData.id, 'preparing')}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                      >
                        Preparing
                      </button>
                      <button
                        onClick={() => updateOrderStatus(selectedTableData.id, 'served')}
                        className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors"
                      >
                        Served
                      </button>
                      <button
                        onClick={() => updateOrderStatus(selectedTableData.id, 'billing')}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                      >
                        Billing
                      </button>
                      <button
                        onClick={() => {
                          updateTableStatus(selectedTableData.id, 'available');
                          updateOrderStatus(selectedTableData.id, undefined);
                        }}
                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
                      >
                        Clear Table
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`text-center py-8 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Select a Table</p>
                <p className="text-sm">Click on any table to view details and manage orders</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Available', count: tables.filter(t => t.status === 'available').length, color: 'bg-green-500' },
          { label: 'Order Placed', count: tables.filter(t => t.orderStatus === 'waiting').length, color: 'bg-yellow-500' },
          { label: 'Preparing', count: tables.filter(t => t.orderStatus === 'preparing').length, color: 'bg-blue-500' },
          { label: 'Dining', count: tables.filter(t => t.orderStatus === 'served').length, color: 'bg-orange-500' },
          { label: 'Billing', count: tables.filter(t => t.orderStatus === 'billing').length, color: 'bg-red-500' },
        ].map((stat) => (
          <div key={stat.label} className={`p-4 rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${stat.color}`}></div>
              <div>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.count}
                </p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableManagement;