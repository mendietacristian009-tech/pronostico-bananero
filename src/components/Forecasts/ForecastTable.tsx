import React, { useState } from 'react';
import { Edit, Eye, Calendar, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

export function ForecastTable() {
  const { forecasts, updateActualProduction } = useData();
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const sortedForecasts = forecasts
    .sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime())
    .slice(0, 20);

  const handleEdit = (forecast: any) => {
    setEditingId(forecast.id);
    setEditValue(forecast.actualBoxes?.toString() || '');
  };

  const handleSave = () => {
    if (editingId && editValue) {
      updateActualProduction(editingId, parseInt(editValue));
      setEditingId(null);
      setEditValue('');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return 'text-gray-500';
    if (accuracy >= 95) return 'text-green-600';
    if (accuracy >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyIcon = (accuracy?: number) => {
    if (!accuracy) return AlertCircle;
    if (accuracy >= 90) return TrendingUp;
    return AlertCircle;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Registro de Pronósticos</h3>
        <p className="text-sm text-gray-500">Últimos 20 pronósticos generados</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empacadora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Semana
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Período
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pronóstico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Real
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precisión
              </th>
              {user?.role === 'admin' && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedForecasts.map((forecast) => {
              const AccuracyIcon = getAccuracyIcon(forecast.accuracy);
              
              return (
                <tr key={forecast.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <Package className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{forecast.facilityName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">S{forecast.week}/{forecast.year}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {forecast.weekStart} - {forecast.weekEnd}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {forecast.forecastedBoxes.toLocaleString()} cajas
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === forecast.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          autoFocus
                        />
                        <button
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-800 text-xs font-medium"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-500 hover:text-gray-700 text-xs font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-900">
                        {forecast.actualBoxes ? `${forecast.actualBoxes.toLocaleString()} cajas` : 'Pendiente'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {forecast.accuracy ? (
                      <div className="flex items-center space-x-1">
                        <AccuracyIcon className={`h-4 w-4 ${getAccuracyColor(forecast.accuracy)}`} />
                        <span className={`text-sm font-medium ${getAccuracyColor(forecast.accuracy)}`}>
                          {forecast.accuracy.toFixed(1)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  {user?.role === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(forecast)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Editar producción real"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
