import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Plus, 
  ShoppingCart, 
  CreditCard, 
  Receipt, 
  Users,
  X
} from 'lucide-react';

interface FloatingActionButtonProps {
  onOrderClick: () => void;
  onPaymentClick: () => void;
  onBillClick: () => void;
  onTableClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onOrderClick,
  onPaymentClick,
  onBillClick,
  onTableClick
}) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    { icon: ShoppingCart, label: 'New Order', onClick: onOrderClick, color: 'bg-blue-500' },
    { icon: CreditCard, label: 'Payment', onClick: onPaymentClick, color: 'bg-green-500' },
    { icon: Receipt, label: 'Bill', onClick: onBillClick, color: 'bg-purple-500' },
    { icon: Users, label: 'Tables', onClick: onTableClick, color: 'bg-orange-500' },
  ];

  return (
    <div className="fab">
      {/* Action Buttons */}
      {isExpanded && (
        <div className="flex flex-col space-y-3 mb-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  setIsExpanded(false);
                }}
                className={`${action.color} hover:scale-110 text-white p-3 rounded-full shadow-lg transition-all duration-300 animate-scale-in flex items-center space-x-2 group`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden group-hover:block text-sm font-medium whitespace-nowrap">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isDark 
            ? 'bg-gradient-to-r from-gs-gold to-gs-light-gold' 
            : 'bg-gradient-to-r from-gs-gold to-gs-light-gold'
        } text-white flex items-center justify-center animate-float`}
      >
        {isExpanded ? (
          <X className="h-6 w-6 animate-rotate-in" />
        ) : (
          <Plus className="h-6 w-6 animate-bounce-in" />
        )}
      </button>
    </div>
  );
};

export default FloatingActionButton;