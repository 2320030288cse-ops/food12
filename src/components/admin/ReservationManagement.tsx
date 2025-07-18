import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Calendar, Clock, Users, Phone, CheckCircle, XCircle } from 'lucide-react';

const ReservationManagement: React.FC = () => {
  const { reservations, tables, updateReservation, updateTableStatus } = useData();
  const { isDark } = useTheme();
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredReservations = reservations.filter(reservation => {
    return filterStatus === 'all' || reservation.status === filterStatus;
  });

  const handleStatusUpdate = (reservationId: string, status: 'confirmed' | 'cancelled') => {
    updateReservation(reservationId, { status });
    
    // Update table status accordingly
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      if (status === 'confirmed') {
        updateTableStatus(reservation.tableId, 'reserved');
      } else {
        updateTableStatus(reservation.tableId, 'available');
      }
    }
  };

  const getTableNumber = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    return table ? table.number : 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'cancelled': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Reservation Management
        </h2>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
        >
          <option value="all">All Reservations</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <div className={`text-center py-12 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No reservations found</p>
          </div>
        ) : (
          filteredReservations.map((reservation) => (
            <div key={reservation.id} className={`rounded-lg border p-6 transition-colors ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            } shadow-lg`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-4">
                    <h3 className={`text-lg font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {reservation.customerName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getStatusColor(reservation.status)
                    }`}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className={`h-4 w-4 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {new Date(reservation.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className={`h-4 w-4 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {reservation.time}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className={`h-4 w-4 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {reservation.people} people
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Phone className={`h-4 w-4 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {reservation.customerPhone}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Table {getTableNumber(reservation.tableId)}
                  </div>
                </div>
                
                {reservation.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Confirm</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Table Status Overview */}
      <div className={`rounded-lg border p-6 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Table Status Overview
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {tables.map((table) => (
            <div key={table.id} className={`p-4 rounded-lg border text-center ${
              table.status === 'available' 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : table.status === 'reserved'
                  ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}>
              <div className={`text-lg font-semibold ${
                table.status === 'available' 
                  ? 'text-green-800 dark:text-green-200' 
                  : table.status === 'reserved'
                    ? 'text-yellow-800 dark:text-yellow-200'
                    : 'text-red-800 dark:text-red-200'
              }`}>
                Table {table.number}
              </div>
              <div className={`text-sm ${
                table.status === 'available' 
                  ? 'text-green-600 dark:text-green-400' 
                  : table.status === 'reserved'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
              }`}>
                {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
              </div>
              <div className={`text-xs mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {table.capacity} seats
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReservationManagement;