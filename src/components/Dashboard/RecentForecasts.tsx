import React from 'react';
import { Calendar, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export function RecentForecasts() {
  const { forecasts } = useData();

  const recentForecasts = forecasts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Pronósticos Recientes</h3>
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {recentForecasts.map((forecast) => (
          <div key={forecast.id} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900">{forecast.facilityName}</p>
                <p className="text-sm text-gray-500">
                  Semana {forecast.week}/{forecast.year} • {forecast.weekStart}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-left sm:text-right">
                <p className="font-semibold text-gray-900">
                  {forecast.forecastedBoxes.toLocaleString()} cajas
                </p>
                {forecast.actualBoxes && forecast.accuracy && (
                  <div className="flex items-center space-x-1">
                    {forecast.accuracy > 90 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${forecast.accuracy > 90 ? 'text-green-600' : 'text-red-600'}`}>
                      {forecast.accuracy.toFixed(1)}% precisión
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
