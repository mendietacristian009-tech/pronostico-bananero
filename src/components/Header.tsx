import React from 'react';
import { WashingMachine } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <WashingMachine size={36} className="text-white" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">LavaFuzzy</h1>
              <p className="text-sm md:text-base text-blue-100">Simulador de Sistema Embebido con Lógica Difusa</p>
            </div>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li><a href="#simulador" className="hover:text-blue-200 transition">Simulador</a></li>
              <li><a href="#reglas" className="hover:text-blue-200 transition">Reglas Difusas</a></li>
              <li><a href="#info" className="hover:text-blue-200 transition">Información</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;