import { Outlet } from 'react-router-dom';
import Sidebar from './navigation/Sidebar';
import TopBar from './navigation/TopBar';
import { useState, useEffect } from 'react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-primary-800 lg:translate-x-0 lg:static lg:inset-0`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;