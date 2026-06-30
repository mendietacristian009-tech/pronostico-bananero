import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, CreditCard, Trash2 } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import CarritoItem from '../components/CarritoItem';

const CarritoPage: React.FC = () => {
  const { carrito, vaciarCarrito, calcularTotal } = useCarrito();
  const [codigoCupon, setCodigoCupon] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(false);
  const [cuponError, setCuponError] = useState(false);
  
  const handleAplicarCupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigoCupon.toLowerCase() === 'descuento10') {
      setDescuentoAplicado(true);
      setCuponError(false);
    } else {
      setCuponError(true);
      setDescuentoAplicado(false);
    }
  };
  
  const handleVaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      vaciarCarrito();
      setDescuentoAplicado(false);
      setCodigoCupon('');
    }
  };
  
  const subtotal = calcularTotal();
  const gastosEnvio = subtotal > 300 ? 0 : 19.99;
  const descuento = descuentoAplicado ? subtotal * 0.1 : 0; // 10% de descuento
  const total = subtotal + gastosEnvio - descuento;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tu Carrito</h1>
          {carrito.items.length > 0 && (
            <p className="text-gray-600 mt-2">{carrito.cantidadTotal} {carrito.cantidadTotal === 1 ? 'producto' : 'productos'}</p>
          )}
        </div>
        
        {carrito.items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Lista de productos en carrito */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <div className="flow-root">
                  <ul className="divide-y divide-gray-200">
                    {carrito.items.map((item) => (
                      <li key={item.producto.id} className="py-4">
                        <CarritoItem producto={item.producto} cantidad={item.cantidad} />
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <Link 
                    to="/productos" 
                    className="text-blue-700 hover:text-blue-900 flex items-center"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Seguir comprando
                  </Link>
                  
                  <button 
                    onClick={handleVaciarCarrito}
                    className="text-red-600 hover:text-red-800 flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Vaciar carrito
                  </button>
                </div>
              </div>
              
              {/* Código promocional */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Código promocional</h3>
                <form onSubmit={handleAplicarCupon} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="Introduce tu código"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={codigoCupon}
                    onChange={(e) => setCodigoCupon(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                  >
                    Aplicar
                  </button>
                </form>
                {cuponError && (
                  <p className="text-red-600 text-sm mt-2">El código no es válido</p>
                )}
                {descuentoAplicado && (
                  <p className="text-green-600 text-sm mt-2">¡Descuento del 10% aplicado!</p>
                )}
                <p className="text-gray-600 text-sm mt-3">Prueba el código "DESCUENTO10" para obtener un 10% de descuento.</p>
              </div>
            </div>
            
            {/* Resumen del pedido */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Resumen del Pedido</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800 font-medium">€{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gastos de envío</span>
                    {gastosEnvio === 0 ? (
                      <span className="text-green-600 font-medium">Gratis</span>
                    ) : (
                      <span className="text-gray-800 font-medium">€{gastosEnvio.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {descuentoAplicado && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento (10%)</span>
                      <span>-€{descuento.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-800 font-semibold">Total</span>
                      <span className="text-xl text-blue-700 font-bold">€{total.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">IVA incluido</p>
                  </div>
                </div>
                
                <button 
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg mt-6 flex items-center justify-center transition-colors duration-300"
                >
                  <CreditCard size={20} className="mr-2" />
                  Finalizar compra
                </button>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">Envío gratis en pedidos superiores a €300</p>
                </div>
                
                <div className="mt-6 flex justify-center space-x-6">
                  <img src="https://images.pexels.com/photos/6802048/pexels-photo-6802048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Visa" className="h-8" />
                  <img src="https://images.pexels.com/photos/6802048/pexels-photo-6802048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Mastercard" className="h-8" />
                  <img src="https://images.pexels.com/photos/6802048/pexels-photo-6802048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="PayPal" className="h-8" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6 flex justify-center">
              <ShoppingBag size={64} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-6">Parece que aún no has añadido productos a tu carrito.</p>
            <Link
              to="/productos"
              className="inline-block bg-blue-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-800 transition-colors duration-300"
            >
              Explorar productos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarritoPage;