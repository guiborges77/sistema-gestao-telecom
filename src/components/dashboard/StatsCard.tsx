import React from 'react';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/dateUtils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'orange' | 'red';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  color
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    emerald: 'bg-emerald-500 text-white',
    orange: 'bg-orange-500 text-white',
    red: 'bg-red-500 text-white'
  };

  const displayValue = typeof value === 'number' && title.includes('Valor') 
    ? formatCurrency(value) 
    : value;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{displayValue}</p>
          {change && (
            <div className="flex items-center mt-1">
              {change.type === 'increase' ? (
                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${
                change.type === 'increase' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};