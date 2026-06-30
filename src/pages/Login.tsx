import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TrendingUp, LogIn, User, KeyRound } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/common/Button';

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const { login, loading, error } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(error);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg(null);
    const success = await login(data.email, data.password);
    if (!success) {
      setErrorMsg('Credenciales inválidas. Por favor, inténtelo de nuevo.');
    }
  };

  // Demo user credentials
  const demoCredentials = [
    { role: 'Administrador', email: 'admin@bananaforescast.com', password: 'admin123' },
    { role: 'Gerente', email: 'manager@bananaforescast.com', password: 'manager123' },
    { role: 'Ingeniero', email: 'engineer@bananaforescast.com', password: 'engineer123' },
    { role: 'Personal', email: 'staff@bananaforescast.com', password: 'staff123' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-600 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <TrendingUp size={48} className="text-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Sistema de Pronóstico de Cajas de Plátano
        </h2>
        <p className="mt-2 text-center text-sm text-primary-100">
          Inicie sesión para acceder al sistema
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="correo@ejemplo.com"
                  {...register('email', { 
                    required: 'Correo electrónico es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Correo electrónico inválido'
                    } 
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound size={16} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="••••••••"
                  {...register('password', { required: 'Contraseña es requerida' })}
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {errorMsg && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{errorMsg}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                leftIcon={<LogIn size={16} />}
              >
                Iniciar sesión
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Cuentas de demostración</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {demoCredentials.map((demo, index) => (
                <div key={index} className="rounded-md bg-gray-50 p-3">
                  <h4 className="text-xs font-medium text-gray-900">{demo.role}</h4>
                  <p className="mt-1 text-xs text-gray-500">
                    Email: <span className="font-mono">{demo.email}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Contraseña: <span className="font-mono">{demo.password}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;