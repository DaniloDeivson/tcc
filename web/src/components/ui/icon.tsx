import React from 'react';
import { cn } from '@/lib/utils';

interface IconProps {
  name: string;
  variant?: 'filled' | 'outlined' | 'round';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  variant = 'filled', 
  size = 'md',
  className 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'outlined':
        return 'material-icons-outlined';
      case 'round':
        return 'material-icons-round';
      default:
        return 'material-icons';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  return (
    <span 
      className={cn(
        getVariantClass(),
        getSizeClass(),
        'select-none',
        className
      )}
    >
      {name}
    </span>
  );
};

export default Icon; 