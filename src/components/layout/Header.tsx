import React from 'react';
import { ViewType } from '../../types';
import { Button } from '../ui/Button';
import { 
  BarChart3, 
  Building2, 
  FileText, 
  Users, 
  Phone,
  Bell,
  Settings
} from 'lucide-react';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const navigation = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'operators', label: 'Operadoras', icon: Phone },
    { key: 'contracts', label: 'Contratos', icon: Building2 },
    { key: 'invoices', label: 'Faturas', icon: FileText },
  ] as const;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Phone className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                TelecomManager
              </span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onViewChange(key)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
          {navigation.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onViewChange(key)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};