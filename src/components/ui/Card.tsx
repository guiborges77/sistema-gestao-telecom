import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  padding = 'md',
  hover = false
}) => {
  return (
    <div 
      className={clsx(
        'bg-white rounded-lg shadow-sm border border-gray-200',
        {
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
          'hover:shadow-md transition-shadow duration-200': hover
        },
        className
      )}
    >
      {children}
    </div>
  );
};