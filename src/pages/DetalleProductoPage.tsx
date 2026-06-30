import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productos, categorias } from '../data/productos';
import { useCarrito } from '../context/CarritoContext';
import { ShoppingCart, Heart, Share, ChevronLeft, Check } from 'lucide-react';

const DetalleProductoPage: React.FC = () => {
  const { productoId } = useParams<{ productoId: string }>();
  const { agregarProducto } = useCarrito();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  
  const producto = productos.find(p => p.id === productoId);
  
  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">Lo sentimos, el producto que estás buscando no existe o ha sido eliminado.</p>
          <Link
            to="/productos"
            className="inline-block bg-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors duration-300"
          >
            Ver otros productos
          </Link>
        </div>
      </div>
    );
  }
  
  const categoria = categorias.find(c => c.id === producto.categoriaId);
  const precioConDescuento = producto.descuento > 0 
    ? producto.precio * (1 - producto.descuento / 100) 
    : null;
  
  // Productos relacionados (de la misma categoría)
  const productosRelacionados = productos
    .filter(p => p.categoriaId === producto.categoriaId && p.id !== producto.id)
    .slice(0, 4);
  
  const incrementarCantidad = () => {
    setCantidad(prev => prev + 1);
  };
  
  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(prev => prev - 1);
    }
  };
  
  const handleAgregarAlCarrito = () => {
    for (let i = 0; i < cantidad; i++) {
      agregarProducto(producto);
    }
    setMostrarMensaje(true);
    setTimeout(() => {
      setMostrarMensaje(false);
    }, 3000);
  };
  
  const handleComprarAhora = () => {
    for (let i = 0; i < cantidad; i++) {
      agregarProducto(producto);
    }
    navigate('/carrito');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-700">Inicio</Link>
            <span className="mx-2">/</span>
            <Link to="/productos" className="hover:text-blue-700">Productos</Link>
            {categoria && (
              <>
                <span className="mx-2">/</span>
                <Link to={`/productos/${categoria.id}`} className="hover:text-blue-700">{categoria.nombre}</Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{producto.nombre}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row">
            {/* Imagen del producto */}
            <div className="lg:w-1/2 p-6 bg-gray-100 flex items-center justify-center relative">
              {producto.descuento > 0 && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{producto.descuento}%
                </div>
              )}
              <img 
                src={producto.imagen} 
                alt={producto.nombre} 
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
            
            {/* Información del producto */}
            <div className="lg:w-1/2 p-6 lg:p-8">
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{producto.nombre}</h1>
                <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                
                <div className="flex items-end mb-4">
                  {precioConDescuento ? (
                    <>
                      <span className="text-2xl lg:text-3xl font-bold text-blue-700">€{precioConDescuento.toFixed(2)}</span>
                      <span className="ml-3 text-lg text-gray-500 line-through">€{producto.precio.toFixed(2)}</span>
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                        Ahorro: €{(producto.precio - precioConDescuento).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl lg:text-3xl font-bold text-blue-700">€{producto.precio.toFixed(2)}</span>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Características principales</h3>
                  <ul className="space-y-2">
                    {producto.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-1" />
                        <span>{caracteristica}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <span className="text-gray-700 mr-4">Cantidad:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button 
                    onClick={decrementarCantidad}
                    className="px-3 py-1 text-xl focus:outline-none"
                    disabled={cantidad <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-l border-r border-gray-300">{cantidad}</span>
                  <button 
                    onClick={incrementarCantidad}
                    className="px-3 py-1 text-xl focus:outline-none"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAgregarAlCarrito}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Añadir al carrito
                </button>
                <button
                  onClick={handleComprarAhora}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Comprar ahora
                </button>
              </div>
              
              <div className="flex justify-center mt-4 gap-4">
                <button className="text-gray-500 hover:text-red-600 flex items-center">
                  <Heart size={18} className="mr-1" />
                  <span className="text-sm">Guardar</span>
                </button>
                <button className="text-gray-500 hover:text-blue-600 flex items-center">
                  <Share size={18} className="mr-1" />
                  <span className="text-sm">Compartir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mensaje de confirmación */}
        {mostrarMensaje && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50 animate-fade-in-right">
            <Check size={20} className="mr-2" />
            <span>Producto añadido al carrito</span>
          </div>
        )}
        
        {/* Productos relacionados */}
        {productosRelacionados.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productosRelacionados.map(producto => (
                <Link
                  key={producto.id}
                  to={`/producto/${producto.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={producto.imagen} 
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-700 transition-colors">
                      {producto.nombre}
                    </h3>
                    <p className="text-blue-700 font-bold">
                      €{producto.descuento > 0 
                        ? (producto.precio * (1 - producto.descuento / 100)).toFixed(2) 
                        : producto.precio.toFixed(2)
                      }
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Botón para volver */}
        <div className="mt-8">
          <Link
            to="/productos"
            className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium"
          >
            <ChevronLeft size={16} className="mr-1" />
            Volver a productos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetalleProductoPage;