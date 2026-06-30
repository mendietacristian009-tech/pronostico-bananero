import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { formatDate } from '../../utils/dateUtils';

type TopBarProps = {
  toggleSidebar: () => void;
};

const TopBar = ({ toggleSidebar }: TopBarProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="z-10 py-4 bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-1 mr-4 text-gray-500 focus:outline-none lg:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="text-sm md:text-base text-gray-600">{currentDate}</div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-1 text-gray-500 hover:text-primary-600 focus:outline-none">
            <Bell size={20} />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                {user?.name?.charAt(0) || <User size={16} />}
              </div>
              <span className="hidden md:inline-block font-medium">
                {user?.name || 'Usuario'}
              </span>
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings size={16} className="mr-2" />
                  Configuración
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;