import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Producto } from '../types/types';
import { useCarrito } from '../context/CarritoContext';

type ProductoCardProps = {
  producto: Producto;
};

const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
  const { agregarProducto } = useCarrito();
  const precioConDescuento = producto.descuento > 0 
    ? producto.precio * (1 - producto.descuento / 100) 
    : null;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/producto/${producto.id}`}>
        <div className="relative h-56 overflow-hidden">
          <img 
            src={producto.imagen} 
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {producto.descuento > 0 && (
            <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 text-xs font-bold">
              -{producto.descuento}%
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/producto/${producto.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-700 transition-colors">{producto.nombre}</h3>
        </Link>
        <div className="flex items-center mb-3">
          {precioConDescuento ? (
            <>
              <span className="text-xl font-bold text-blue-700">€{precioConDescuento.toFixed(2)}</span>
              <span className="ml-2 text-sm text-gray-500 line-through">€{producto.precio.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-blue-700">€{producto.precio.toFixed(2)}</span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <Link 
            to={`/producto/${producto.id}`} 
            className="text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            Ver detalles
          </Link>
          <button
            onClick={() => agregarProducto(producto)}
            className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full transition-colors"
            aria-label="Añadir al carrito"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoCard;