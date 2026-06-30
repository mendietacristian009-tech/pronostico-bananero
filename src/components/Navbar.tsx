import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import { categorias } from '../data/productos';

const Navbar: React.FC = () => {
  const { carrito } = useCarrito();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?buscar=${searchQuery}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-700">Electro<span className="text-red-600">Hogar</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-700">
                Categorías
              </button>
              <div className="absolute z-10 left-0 w-48 mt-2 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {categorias.map((categoria) => (
                  <Link
                    key={categoria.id}
                    to={`/productos/${categoria.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {categoria.nombre}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/productos" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-700">
              Todos los Productos
            </Link>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-64 px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mr-3 mt-2 text-gray-400 hover:text-blue-700"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          <div className="flex items-center">
            <Link to="/carrito" className="ml-4 relative p-2 text-gray-700 hover:text-blue-700">
              <ShoppingCart size={24} />
              {carrito.cantidadTotal > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {carrito.cantidadTotal}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="ml-2 md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-700 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-4 space-y-1">
            <form onSubmit={handleSearch} className="px-4 py-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mr-3 mt-2 text-gray-400 hover:text-blue-700"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
            <Link
              to="/productos"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Todos los Productos
            </Link>
            <div className="px-4 py-2">
              <p className="text-base font-medium text-gray-700">Categorías</p>
              <div className="mt-2 pl-4 space-y-1">
                {categorias.map((categoria) => (
                  <Link
                    key={categoria.id}
                    to={`/productos/${categoria.id}`}
                    className="block py-1 text-sm text-gray-600 hover:text-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {categoria.nombre}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;