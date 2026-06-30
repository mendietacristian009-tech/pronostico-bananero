import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-semibold mt-4 text-gray-800">Página no encontrada</h2>
        <p className="mt-2 text-gray-600">
          Lo sentimos, la página que busca no existe o ha sido movida.
        </p>
        <div className="mt-6">
          <Link to="/">
            <Button leftIcon={<Home size={16} />}>
              Regresar al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;