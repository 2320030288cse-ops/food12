import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, change, delay = 0 }) => {
  const { isDark } = useTheme();

  return (
    <div 
      className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fade-in ${
        isDark 
          ? 'glass-dark border-gray-700' 
          : 'glass border-white/20'
      } shadow-xl backdrop-blur-xl hover:shadow-glow-primary`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-1 gradient-text animate-bounce-in ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </p>
          {change && (
            <p className={`text-sm mt-1 font-medium animate-slide-up ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-full ${color} shadow-xl animate-float`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;