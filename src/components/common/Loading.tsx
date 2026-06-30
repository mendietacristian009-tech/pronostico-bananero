import { TrendingUp } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <TrendingUp size={40} className="mx-auto text-primary-600 animate-pulse-gentle" />
        <h2 className="mt-4 text-xl font-semibold text-gray-800">Cargando...</h2>
        <p className="mt-2 text-gray-600">Preparando el sistema de pronóstico</p>
      </div>
    </div>
  );
};

export default Loading;