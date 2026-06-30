import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, 
  Home, 
  Building2, 
  TrendingUp, 
  FileText, 
  Settings,
  Users,
  Upload
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'engineer', 'warehouse'] },
    { id: 'forecasts', label: 'Pronósticos', icon: TrendingUp, roles: ['admin', 'engineer', 'warehouse'] },
    { id: 'facilities', label: 'Empacadoras', icon: Building2, roles: ['admin'] },
    { id: 'reports', label: 'Reportes', icon: FileText, roles: ['admin', 'engineer', 'warehouse'] },
    { id: 'data-upload', label: 'Carga de Datos', icon: Upload, roles: ['admin'] },
    { id: 'users', label: 'Usuarios', icon: Users, roles: ['admin'] },
    { id: 'settings', label: 'Configuración', icon: Settings, roles: ['admin'] }
  ];

  const availableItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="bg-white h-full shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 sm:h-6 w-4 sm:w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">EXFRUMAN</h1>
            <p className="text-xs sm:text-sm text-gray-500">Sistema de Pronósticos</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
        {availableItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors ${
                activeView === item.id
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}