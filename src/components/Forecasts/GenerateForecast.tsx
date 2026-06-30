import React, { useState } from 'react';
import { TrendingUp, Calendar, Package, AlertCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

export function GenerateForecast() {
  const { facilities, generateForecast } = useData();
  const { user } = useAuth();
  const [selectedFacility, setSelectedFacility] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeFacilities = facilities.filter(f => f.active);

  const handleGenerate = async () => {
    if (!selectedFacility) return;
    
    setIsGenerating(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    generateForecast(selectedFacility);
    setIsGenerating(false);
    setSelectedFacility('');
  };

  if (user?.role !== 'admin') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-800">Solo los administradores pueden generar nuevos pronósticos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-start sm:items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-green-600" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">Generar Nuevo Pronóstico</h3>
          <p className="text-sm text-gray-500">Crear pronóstico para la próxima semana</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Empacadora
          </label>
          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isGenerating}
          >
            <option value="">Seleccione una empacadora...</option>
            {activeFacilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name} - {facility.location}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-blue-900">Información del Pronóstico</h4>
              <p className="text-sm text-blue-700 mt-1">
                El pronóstico se generará para la semana del{' '}
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')} usando
                el modelo entrenado con datos históricos desde 2023.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedFacility || isGenerating}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Generando pronóstico...</span>
            </>
          ) : (
            <>
              <Package className="h-4 w-4" />
              <span>Generar Pronóstico</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
