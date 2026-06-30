import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardEdit, 
  TrendingUp, 
  FileText, 
  Settings,
  Users,
  Home,
  X
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types/auth';

type SidebarProps = {
  closeSidebar: () => void;
};

const Sidebar = ({ closeSidebar }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const isAdmin = user?.role === UserRole.ADMIN;
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.ENGINEER, UserRole.STAFF] },
    { name: 'Registro de datos', href: '/data-entry', icon: ClipboardEdit, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { name: 'Pronósticos', href: '/forecasting', icon: TrendingUp, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.ENGINEER] },
    { name: 'Reportes', href: '/reports', icon: FileText, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.ENGINEER] },
    { name: 'Empacadoras', href: '/facilities', icon: Home, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { name: 'Usuarios', href: '/users', icon: Users, roles: [UserRole.ADMIN] },
    { name: 'Configuración', href: '/settings', icon: Settings, roles: [UserRole.ADMIN, UserRole.MANAGER] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || UserRole.STAFF)
  );

  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex items-center justify-between px-4 py-5 lg:py-6">
        <Link to="/" className="flex items-center">
          <TrendingUp size={28} className="text-white mr-2" />
          <span className="text-xl font-bold"></span>
        </Link>
        <button 
          onClick={closeSidebar}
          className="p-1 -mr-1 rounded-md lg:hidden focus:outline-none"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-2 py-3 text-sm font-medium rounded-md mb-1 transition-colors ${
                isActive
                  ? 'bg-primary-900 text-white'
                  : 'text-primary-100 hover:bg-primary-700'
              }`}
              onClick={closeSidebar}
            >
              <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${
                isActive ? 'text-white' : 'text-primary-200'
              }`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="px-4 py-6 bg-primary-900">
        <div className="text-xs text-primary-300">
          <p className="mb-1">Sistema de pronóstico de cajas</p>
          <p>© 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;