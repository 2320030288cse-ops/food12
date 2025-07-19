import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationToastProps {
  notifications: ToastNotification[];
  onRemove: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onRemove }) => {
  const { isDark } = useTheme();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      case 'error': return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      default: return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
          getIcon={getIcon}
          getColors={getColors}
          isDark={isDark}
        />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  notification: ToastNotification;
  onRemove: (id: string) => void;
  getIcon: (type: string) => React.ReactNode;
  getColors: (type: string) => string;
  isDark: boolean;
}> = ({ notification, onRemove, getIcon, getColors, isDark }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(notification.id), 300);
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification.id, notification.duration, onRemove]);

  return (
    <div
      className={`transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`max-w-sm w-full border rounded-lg p-4 shadow-lg animate-slide-in-right ${
        getColors(notification.type)
      } glass backdrop-blur-sm`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 animate-bounce-in">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {notification.title}
            </p>
            <p className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onRemove(notification.id), 300);
            }}
            className={`flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;