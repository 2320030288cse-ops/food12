import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface GSLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const GSLogo: React.FC<GSLogoProps> = ({ size = 'md', animated = false, className = '' }) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} ${animated ? 'animate-float' : ''}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer Circle with Gradient */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#gsGradient)"
          stroke={isDark ? '#ffffff' : '#1f2937'}
          strokeWidth="2"
        />
        
        {/* Inner Decorative Ring */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={isDark ? '#ffffff20' : '#00000020'}
          strokeWidth="1"
          strokeDasharray="4 4"
          className={animated ? 'animate-spin-slow' : ''}
        />
        
        {/* G Letter */}
        <path
          d="M25 35 C25 25, 35 15, 45 15 L55 15 C65 15, 75 25, 75 35 L75 45 L60 45 L60 35 C60 30, 55 25, 50 25 L45 25 C40 25, 35 30, 35 35 L35 65 C35 70, 40 75, 45 75 L55 75 C60 75, 65 70, 65 65 L65 55 L55 55 L55 45 L75 45 L75 65 C75 75, 65 85, 55 85 L45 85 C35 85, 25 75, 25 65 Z"
          fill={isDark ? '#ffffff' : '#1f2937'}
          className={animated ? 'animate-pulse-glow' : ''}
        />
        
        {/* S Letter */}
        <path
          d="M80 25 C80 20, 85 15, 90 15 C95 15, 100 20, 100 25 C100 30, 95 35, 90 35 C85 35, 80 40, 80 45 C80 50, 85 55, 90 55 C95 55, 100 60, 100 65 C100 70, 95 75, 90 75 C85 75, 80 70, 80 65"
          fill="none"
          stroke={isDark ? '#ffffff' : '#1f2937'}
          strokeWidth="3"
          strokeLinecap="round"
          className={animated ? 'animate-glow' : ''}
        />
        
        {/* Chef Hat Icon */}
        <g transform="translate(35, 5)">
          <ellipse cx="15" cy="8" rx="12" ry="6" fill={isDark ? '#ffffff40' : '#00000040'} />
          <rect x="8" y="8" width="14" height="8" rx="2" fill={isDark ? '#ffffff60' : '#00000060'} />
          <circle cx="12" cy="4" r="2" fill={isDark ? '#ffffff80' : '#00000080'} />
          <circle cx="18" cy="3" r="1.5" fill={isDark ? '#ffffff80' : '#00000080'} />
        </g>
        
        {/* Decorative Stars */}
        <g className={animated ? 'animate-twinkle' : ''}>
          <polygon points="15,20 16,22 18,22 16.5,23.5 17,25 15,24 13,25 13.5,23.5 12,22 14,22" 
                   fill={isDark ? '#ffffff60' : '#00000060'} />
          <polygon points="85,75 86,77 88,77 86.5,78.5 87,80 85,79 83,80 83.5,78.5 82,77 84,77" 
                   fill={isDark ? '#ffffff60' : '#00000060'} />
        </g>
        
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="gsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default GSLogo;