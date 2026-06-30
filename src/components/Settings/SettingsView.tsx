import React, { useState } from 'react';
import { Settings, Save, Database, Bell, Shield, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function SettingsView() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // General Settings
    systemName: '',
    defaultLanguage: 'es',
    timezone: 'America/Costa_Rica',
    
    // Forecast Settings
    forecastAccuracyThreshold: 85,
    maxWeeksHistory: 52,
    defaultForecastWeeks: 1,
    
    // Data Settings
    autoBackup: true,
    backupFrequency: 'weekly',
    dataRetentionMonths: 24,
    
    // Notification Settings
    emailNotifications: false,
    systemAlerts: true,
    accuracyAlerts: true,
    
    // Security Settings
    sessionTimeout: 480, // minutes
    passwordMinLength: 6,
    requirePasswordChange: false,
    
    // Export Settings
    defaultExportFormat: 'excel',
    includeChartsInPDF: true,
    maxExportRecords: 1000
  });

  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSave = async () => {
    setSaveStatus('saving');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (user?.role !== 'admin') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <p className="text-yellow-800">Solo los administradores pueden acceder a la configuración del sistema.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'forecasts', label: 'Pronósticos', icon: Database },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'exports', label: 'Exportación', icon: Globe }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>
          <p className="text-gray-500 mt-1">Administrar configuraciones y parámetros del sistema</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {saveStatus === 'saving' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{saveStatus === 'saving' ? 'Guardando...' : 'Guardar Cambios'}</span>
        </button>
      </div>

      {saveStatus === 'saved' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800">Configuración guardada exitosamente</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuración General</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Sistema
                  </label>
                  <input
                    type="text"
                    value={settings.systemName}
                    onChange={(e) => handleSettingChange('systemName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idioma Predeterminado
                  </label>
                  <select
                    value={settings.defaultLanguage}
                    onChange={(e) => handleSettingChange('defaultLanguage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona Horaria
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="America/Costa_Rica">Costa Rica (UTC-6)</option>
                    <option value="America/New_York">New York (UTC-5)</option>
                    <option value="America/Los_Angeles">Los Angeles (UTC-8)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'forecasts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuración de Pronósticos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Umbral de Precisión Mínima (%)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={settings.forecastAccuracyThreshold}
                    onChange={(e) => handleSettingChange('forecastAccuracyThreshold', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Precisión mínima aceptable para pronósticos</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semanas de Historial Máximo
                  </label>
                  <input
                    type="number"
                    min="12"
                    max="104"
                    value={settings.maxWeeksHistory}
                    onChange={(e) => handleSettingChange('maxWeeksHistory', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Cantidad máxima de semanas históricas a considerar</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semanas de Pronóstico por Defecto
                  </label>
                  <select
                    value={settings.defaultForecastWeeks}
                    onChange={(e) => handleSettingChange('defaultForecastWeeks', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="1">1 semana</option>
                    <option value="2">2 semanas</option>
                    <option value="4">4 semanas</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuración de Notificaciones</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Notificaciones por Email</h4>
                    <p className="text-sm text-gray-500">Enviar notificaciones importantes por correo electrónico</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Alertas del Sistema</h4>
                    <p className="text-sm text-gray-500">Mostrar alertas importantes en la interfaz</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.systemAlerts}
                      onChange={(e) => handleSettingChange('systemAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Alertas de Precisión</h4>
                    <p className="text-sm text-gray-500">Notificar cuando la precisión esté por debajo del umbral</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.accuracyAlerts}
                      onChange={(e) => handleSettingChange('accuracyAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuración de Seguridad</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo de Sesión (minutos)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="1440"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tiempo antes de cerrar sesión automáticamente</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitud Mínima de Contraseña
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="20"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Requerir Cambio de Contraseña</h4>
                      <p className="text-sm text-gray-500">Obligar a los usuarios a cambiar su contraseña periódicamente</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.requirePasswordChange}
                        onChange={(e) => handleSettingChange('requirePasswordChange', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exports' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuración de Exportación</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato de Exportación por Defecto
                  </label>
                  <select
                    value={settings.defaultExportFormat}
                    onChange={(e) => handleSettingChange('defaultExportFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Registros por Exportación
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={settings.maxExportRecords}
                    onChange={(e) => handleSettingChange('maxExportRecords', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Incluir Gráficos en PDF</h4>
                      <p className="text-sm text-gray-500">Incluir gráficos y visualizaciones en las exportaciones PDF</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.includeChartsInPDF}
                        onChange={(e) => handleSettingChange('includeChartsInPDF', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}