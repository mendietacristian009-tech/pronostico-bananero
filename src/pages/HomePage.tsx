import React from 'react';
import { Link } from 'react-router-dom';
import ProductoCard from '../components/ProductoCard';
import { productos, categorias } from '../data/productos';
import { ChevronRight, Refrigerator, CookingPot as Cooking, Tv, Waves } from 'lucide-react';

const HomePage: React.FC = () => {
  const productosDestacados = productos.filter(producto => producto.destacado);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Electrodomésticos de calidad para tu hogar
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Descubre nuestra amplia selección de electrodomésticos con las mejores marcas y precios incomparables.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/productos" 
                  className="inline-block bg-white text-blue-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Ver Productos
                </Link>
                <Link 
                  to="/productos/ofertas" 
                  className="inline-block bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300"
                >
                  Ofertas Especiales
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <img 
                src="https://images.pexels.com/photos/6969266/pexels-photo-6969266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Electrodomésticos modernos" 
                className="rounded-lg shadow-xl max-h-96 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Categorías */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Categorías Populares</h2>
            <p className="mt-2 text-lg text-gray-600">Explora nuestras categorías de electrodomésticos</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link 
              to="/productos/cocina" 
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-blue-700 mb-4 flex justify-center">
                <Cooking size={48} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Cocina</h3>
            </Link>
            
            <Link 
              to="/productos/refrigeracion" 
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-blue-700 mb-4 flex justify-center">
                <Refrigerator size={48} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Refrigeración</h3>
            </Link>
            
            <Link 
              to="/productos/lavanderia" 
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-blue-700 mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="20" x="3" y="2" rx="2" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="12" cy="12" r="1" />
                  <line x1="3" x2="21" y1="7" y2="7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Lavandería</h3>
            </Link>
            
            <Link 
              to="/productos/climatizacion" 
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-blue-700 mb-4 flex justify-center">
                <Waves size={48} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Climatización</h3>
            </Link>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              to="/productos" 
              className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium"
            >
              Ver todas las categorías <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Productos Destacados */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Productos Destacados</h2>
            <p className="mt-2 text-lg text-gray-600">Nuestras mejores selecciones para tu hogar</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosDestacados.map(producto => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/productos" 
              className="inline-block bg-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors duration-300"
            >
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>
      
      {/* Beneficios */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">¿Por qué elegirnos?</h2>
            <p className="mt-2 text-lg text-gray-600">Descubre las ventajas de comprar en ElectroHogar</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22v-5" /><path d="M9 8V2" /><path d="M15 8V2" /><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Entrega Gratis</h3>
              <p className="text-gray-600">En todos los pedidos superiores a €300 en toda España peninsular.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Garantía Extendida</h3>
              <p className="text-gray-600">2 años de garantía en todos nuestros productos y servicio técnico oficial.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Atención Personalizada</h3>
              <p className="text-gray-600">Asesoramiento experto y atención al cliente 7 días a la semana.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonios */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Lo que dicen nuestros clientes</h2>
            <p className="mt-2 text-lg text-gray-600">Testimonios de clientes satisfechos</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">"Excelente servicio, compré una nevera y la entrega fue rápida y en perfecto estado. El instalador fue muy profesional."</p>
              <p className="font-semibold text-gray-800">María García</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">"Precios muy competitivos y una gran variedad de productos. Me encantó la lavadora que compré, funciona de maravilla."</p>
              <p className="font-semibold text-gray-800">Carlos Rodríguez</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(4)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">"Atención al cliente excepcional, me ayudaron a elegir el aire acondicionado perfecto para mi casa. Muy recomendable."</p>
              <p className="font-semibold text-gray-800">Ana Martínez</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Banner */}
      <section className="bg-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para renovar tus electrodomésticos?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Descubre nuestras ofertas especiales y productos de alta calidad para hacer tu vida más cómoda.
          </p>
          <Link 
            to="/productos" 
            className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Comprar Ahora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;