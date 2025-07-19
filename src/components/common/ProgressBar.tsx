import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Clock, ChefHat, Truck, CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  steps: string[];
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  steps = ['Order Received', 'Preparing', 'Ready', 'Delivered'],
  animated = true 
}) => {
  const { isDark } = useTheme();

  const getStepIcon = (index: number) => {
    const icons = [Clock, ChefHat, Truck, CheckCircle];
    const Icon = icons[index] || Clock;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                ${index <= currentStep 
                  ? 'bg-gradient-to-r from-gs-gold to-gs-light-gold text-white shadow-glow-gold' 
                  : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                }
                ${animated && index === currentStep ? 'animate-pulse-glow' : ''}
              `}
            >
              {getStepIcon(index)}
            </div>
            <span className={`text-xs mt-2 text-center ${
              index <= currentStep 
                ? isDark ? 'text-white' : 'text-gray-900'
                : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      
      {/* Progress Line */}
      <div className={`relative h-2 rounded-full ${
        isDark ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-gs-gold to-gs-light-gold rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        >
          {animated && (
            <div className="absolute right-0 top-0 h-full w-4 bg-white opacity-50 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;