import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, change }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-105 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } shadow-lg animate-fade-in`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </p>
          {change && (
            <p className={`text-sm mt-1 ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;