import React from 'react';
import { Trash, Plus, Minus } from 'lucide-react';
import { Producto } from '../types/types';
import { useCarrito } from '../context/CarritoContext';

type CarritoItemProps = {
  producto: Producto;
  cantidad: number;
};

const CarritoItem: React.FC<CarritoItemProps> = ({ producto, cantidad }) => {
  const { actualizarCantidad, removerProducto } = useCarrito();
  
  const handleIncrementar = () => {
    actualizarCantidad(producto.id, cantidad + 1);
  };
  
  const handleDecrementar = () => {
    if (cantidad > 1) {
      actualizarCantidad(producto.id, cantidad - 1);
    } else {
      removerProducto(producto.id);
    }
  };

  const precioConDescuento = producto.descuento > 0 
    ? producto.precio * (1 - producto.descuento / 100) 
    : producto.precio;
  
  const subtotal = precioConDescuento * cantidad;
  
  return (
    <div className="flex flex-col sm:flex-row items-center border-b border-gray-200 py-4 group">
      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden mb-4 sm:mb-0">
        <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-grow sm:ml-6">
        <h3 className="text-lg font-semibold text-gray-800">{producto.nombre}</h3>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2">
          <div className="text-blue-700 font-bold mb-2 sm:mb-0">
            €{precioConDescuento.toFixed(2)}
            {producto.descuento > 0 && (
              <span className="ml-2 text-sm text-gray-500 line-through">€{producto.precio.toFixed(2)}</span>
            )}
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={handleDecrementar}
              className="text-gray-500 hover:text-blue-700 p-1"
              aria-label="Disminuir cantidad"
            >
              <Minus size={16} />
            </button>
            
            <span className="mx-2 w-8 text-center">{cantidad}</span>
            
            <button 
              onClick={handleIncrementar}
              className="text-gray-500 hover:text-blue-700 p-1"
              aria-label="Aumentar cantidad"
            >
              <Plus size={16} />
            </button>
            
            <button 
              onClick={() => removerProducto(producto.id)}
              className="ml-4 text-gray-400 hover:text-red-600 p-1"
              aria-label="Eliminar producto"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-right text-gray-600">
          <span>Subtotal: <span className="font-semibold">€{subtotal.toFixed(2)}</span></span>
        </div>
      </div>
    </div>
  );
};

export default CarritoItem;