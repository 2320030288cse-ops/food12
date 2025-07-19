import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'flip';
  clickable?: boolean;
  onClick?: () => void;
  delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  hoverEffect = 'lift',
  clickable = false,
  onClick,
  delay = 0
}) => {
  const { isDark } = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);

  const getHoverClasses = () => {
    switch (hoverEffect) {
      case 'lift':
        return 'hover:transform hover:-translate-y-2 hover:shadow-xl';
      case 'glow':
        return 'hover:shadow-glow-gold hover:animate-glow';
      case 'scale':
        return 'hover:scale-105';
      case 'flip':
        return 'hover:animate-flip';
      default:
        return 'hover:transform hover:-translate-y-1';
    }
  };

  const handleClick = () => {
    if (hoverEffect === 'flip') {
      setIsFlipped(!isFlipped);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        transition-all duration-300 ease-out animate-fade-in
        ${getHoverClasses()}
        ${clickable ? 'cursor-pointer' : ''}
        ${isDark ? 'glass-dark' : 'glass'}
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleClick}
    >
      <div className={`${isFlipped ? 'animate-flip' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedCard;