import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductoCard from '../components/ProductoCard';
import { productos, categorias } from '../data/productos';
import { Filter, X } from 'lucide-react';

const ProductosPage: React.FC = () => {
  const { categoriaId } = useParams<{ categoriaId?: string }>();
  const location = useLocation();
  const [productosFiltrados, setProductosFiltrados] = useState(productos);
  const [precioMin, setPrecioMin] = useState<number>(0);
  const [precioMax, setPrecioMax] = useState<number>(2000);
  const [mostrarFiltrosMobil, setMostrarFiltrosMobil] = useState(false);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<string | null>(null);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const termino = searchParams.get('buscar');
    
    let productosFiltrados = [...productos];
    
    // Filtrar por categoría si está presente
    if (categoriaId) {
      productosFiltrados = productosFiltrados.filter(
        producto => producto.categoriaId === categoriaId
      );
      setFiltroSeleccionado(categoriaId);
    } else {
      setFiltroSeleccionado(null);
    }
    
    // Filtrar por término de búsqueda si está presente
    if (termino) {
      const terminoLower = termino.toLowerCase();
      productosFiltrados = productosFiltrados.filter(
        producto => 
          producto.nombre.toLowerCase().includes(terminoLower) || 
          producto.descripcion.toLowerCase().includes(terminoLower)
      );
    }
    
    // Aplicar filtro de precio
    productosFiltrados = productosFiltrados.filter(
      producto => {
        const precioFinal = producto.descuento > 0 
          ? producto.precio * (1 - producto.descuento / 100) 
          : producto.precio;
        
        return precioFinal >= precioMin && precioFinal <= precioMax;
      }
    );
    
    setProductosFiltrados(productosFiltrados);
  }, [categoriaId, location.search, precioMin, precioMax]);
  
  const nombreCategoria = categoriaId 
    ? categorias.find(cat => cat.id === categoriaId)?.nombre 
    : 'Todos los Productos';
  
  const toggleFiltrosMobil = () => {
    setMostrarFiltrosMobil(!mostrarFiltrosMobil);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{nombreCategoria}</h1>
          {productosFiltrados.length > 0 ? (
            <p className="text-gray-600 mt-2">Mostrando {productosFiltrados.length} productos</p>
          ) : (
            <p className="text-gray-600 mt-2">No se encontraron productos que coincidan con los criterios de búsqueda</p>
          )}
        </div>
        
        {/* Botón de filtros para móvil */}
        <button
          className="md:hidden bg-white shadow-md rounded-lg px-4 py-2 flex items-center text-gray-700 mb-4"
          onClick={toggleFiltrosMobil}
        >
          <Filter size={18} className="mr-2" />
          Filtros
        </button>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtros laterales */}
          <div className={`md:w-64 flex-shrink-0 transition-all duration-300 ${
            mostrarFiltrosMobil 
              ? 'fixed inset-0 bg-white z-50 p-4 overflow-auto' 
              : 'hidden md:block'
          }`}>
            {mostrarFiltrosMobil && (
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Filtros</h2>
                <button onClick={toggleFiltrosMobil} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Categorías</h3>
              <div className="space-y-2">
                <div 
                  className={`cursor-pointer flex items-center ${filtroSeleccionado === null ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
                  onClick={() => window.location.href = '/productos'}
                >
                  <span>Todos los Productos</span>
                </div>
                {categorias.map(categoria => (
                  <div 
                    key={categoria.id} 
                    className={`cursor-pointer flex items-center ${filtroSeleccionado === categoria.id ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
                    onClick={() => window.location.href = `/productos/${categoria.id}`}
                  >
                    <span>{categoria.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Precio</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label htmlFor="precioMin" className="text-sm text-gray-600">Mínimo</label>
                    <span className="text-sm font-medium">€{precioMin}</span>
                  </div>
                  <input 
                    type="range" 
                    id="precioMin" 
                    min="0" 
                    max="2000" 
                    step="50" 
                    value={precioMin} 
                    onChange={(e) => setPrecioMin(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label htmlFor="precioMax" className="text-sm text-gray-600">Máximo</label>
                    <span className="text-sm font-medium">€{precioMax}</span>
                  </div>
                  <input 
                    type="range" 
                    id="precioMax" 
                    min="0" 
                    max="2000" 
                    step="50" 
                    value={precioMax} 
                    onChange={(e) => setPrecioMax(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="flex justify-between text-sm pt-2">
                  <span>€0</span>
                  <span>€2,000</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lista de productos */}
          <div className="flex-grow">
            {productosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosFiltrados.map(producto => (
                  <ProductoCard key={producto.id} producto={producto} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600 mb-4">Intenta ajustar los filtros o buscar con otros términos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductosPage;