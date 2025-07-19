import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  overlay = false 
}) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} relative`}>
        <div className={`${sizeClasses[size]} border-4 border-gs-cream rounded-full animate-spin`}>
          <div className={`${sizeClasses[size]} border-4 border-transparent border-t-gs-gold rounded-full animate-spin`}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-gs-gold rounded-full animate-pulse"></div>
        </div>
      </div>
      {text && (
        <p className={`${textSizeClasses[size]} font-medium animate-pulse ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className={`p-8 rounded-xl shadow-2xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } glass animate-scale-in`}>
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;