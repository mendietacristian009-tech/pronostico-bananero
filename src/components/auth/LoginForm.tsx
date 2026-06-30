import React, { useState } from 'react';
import { TrendingUp, User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginForm() {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(credentials.username, credentials.password);
      if (!success) {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-6 px-3 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900">EXFRUMAN</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Gestión de Pronósticos de Producción de Plátano
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ingrese su usuario"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ingrese su contraseña"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Usuarios de demostración:</p>
              <div className="space-y-1 text-xs">
                <p><strong>admin</strong> - Administrador (acceso completo)</p>
                <p><strong>engineer</strong> - Ingeniero Agrónomo (solo consulta)</p>
                <p><strong>warehouse</strong> - Encargado de Almacén (solo consulta)</p>
                <p className="mt-2"><strong>Contraseña:</strong> demo123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
