import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { StatsCards } from './components/Dashboard/StatsCards';
import { ForecastChart } from './components/Dashboard/ForecastChart';
import { RecentForecasts } from './components/Dashboard/RecentForecasts';
import { ForecastTable } from './components/Forecasts/ForecastTable';
import { GenerateForecast } from './components/Forecasts/GenerateForecast';
import { FacilityList } from './components/Facilities/FacilityList';
import { ReportsView } from './components/Reports/ReportsView';
import { DataUploadView } from './components/DataUpload/DataUploadView';
import { UsersView } from './components/Users/UsersView';
import { SettingsView } from './components/Settings/SettingsView';

function Dashboard() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ForecastChart />
        <RecentForecasts />
      </div>
    </div>
  );
}

function Forecasts() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ForecastTable />
        </div>
        <div>
          <GenerateForecast />
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Dashboard Principal';
      case 'forecasts': return 'Gestión de Pronósticos';
      case 'facilities': return 'Gestión de Empacadoras';
      case 'reports': return 'Reportes y Análisis';
      case 'data-upload': return 'Carga de Datos de Producción';
      case 'users': return 'Gestión de Usuarios';
      case 'settings': return 'Configuración del Sistema';
      default: return 'Dashboard';
    }
  };

  const getViewSubtitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Resumen general del sistema y métricas clave';
      case 'forecasts': return 'Crear y administrar pronósticos de producción';
      case 'facilities': return 'Administrar empacadoras y sus configuraciones';
      case 'reports': return 'Generar reportes oficiales y exportar datos';
      case 'data-upload': return 'Cargar datos reales de producción para comparaciones';
      case 'users': return 'Administrar usuarios y permisos del sistema';
      case 'settings': return 'Configurar parámetros del sistema';
      default: return '';
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'forecasts': return <Forecasts />;
      case 'facilities': return <FacilityList />;
      case 'reports': return <ReportsView />;
      case 'data-upload': return <DataUploadView />;
      case 'users': return <UsersView />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-dvh bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar activeView={activeView} onViewChange={(view) => {
          setActiveView(view);
          setSidebarOpen(false);
        }} />
      </div>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:ml-0">
        <Header
          title={getViewTitle()}
          subtitle={getViewSubtitle()}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-auto p-3 sm:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
