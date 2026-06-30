import React from 'react';
import { LogOut, Menu, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-4">
            {/* <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">EXFRUMAN</h1> */}
            <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
            <div className="hidden sm:block min-w-0">
              <h2 className="text-lg font-semibold text-gray-700 truncate">{title}</h2>
              {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="sm:hidden min-w-0">
            <h2 className="text-base font-semibold text-gray-700 truncate">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500 line-clamp-2">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-2 sm:px-3 py-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
