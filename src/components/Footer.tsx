import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2025 LavaFuzzy - Simulador Educativo</p>
            <p className="text-sm text-gray-400">Aplicación didáctica para enseñanza de sistemas embebidos con lógica difusa</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-white transition">Acerca de</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Contacto</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Recursos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;