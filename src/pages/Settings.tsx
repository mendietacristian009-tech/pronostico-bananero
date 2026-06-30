import { useState } from 'react';
import { Save, Bell, Moon, Sun, Globe, AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuthStore } from '../stores/authStore';

const Settings = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('es');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to backend
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Administre sus preferencias del sistema</p>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-success-50 border-l-4 border-success-500 p-4 mb-6 animate-slide-up">
          <div className="flex">
            <div className="flex-shrink-0">
              <Save className="h-5 w-5 text-success-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-success-700">
                La configuración se ha guardado correctamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Perfil de Usuario</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={user?.name || ''}
                readOnly
                className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <input
                type="text"
                value={user?.role || ''}
                readOnly
                className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700"
              />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Preferencias</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Notificaciones</p>
                  <p className="text-sm text-gray-500">Recibir alertas del sistema</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {theme === 'light' ? (
                  <Sun className="h-5 w-5 text-gray-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900">Tema</p>
                  <p className="text-sm text-gray-500">Personalice la apariencia</p>
                </div>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                className="rounded-md border border-gray-300 py-1.5 pl-3 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Idioma</p>
                  <p className="text-sm text-gray-500">Seleccione el idioma del sistema</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-md border border-gray-300 py-1.5 pl-3 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Zona de Peligro</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-error-50 rounded-lg">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-error-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-error-800">Eliminar cuenta</h3>
                <p className="mt-1 text-sm text-error-700">
                  Una vez que elimine su cuenta, no hay vuelta atrás. Por favor, esté seguro.
                </p>
                <div className="mt-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      // In a real app, this would trigger a confirmation modal
                      alert('Esta función está deshabilitada en el demo');
                    }}
                  >
                    Eliminar cuenta
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            variant="primary"
            leftIcon={<Save size={16} />}
            onClick={handleSave}
          >
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;