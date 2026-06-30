import React from 'react';
import { TrendingUp, TrendingDown, Package, Building2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export function StatsCards() {
  const { facilities, forecasts } = useData();

  const activeFacilities = facilities.filter(f => f.active).length;
  const currentWeekForecasts = forecasts.filter(f => {
    const currentWeek = Math.ceil(((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7);
    return f.week === currentWeek && f.year === new Date().getFullYear();
  });

  const totalForecastedBoxes = currentWeekForecasts.reduce((sum, f) => sum + f.forecastedBoxes, 0);
  const totalActualBoxes = currentWeekForecasts.reduce((sum, f) => sum + (f.actualBoxes || 0), 0);

  const forecastsWithAccuracy = currentWeekForecasts.filter(f => f.accuracy !== undefined);
  const averageAccuracy = forecastsWithAccuracy.length > 0
    ? forecastsWithAccuracy.reduce((sum, f) => sum + (f.accuracy || 0), 0) / forecastsWithAccuracy.length
    : null;
  const stats = [
    {
      title: 'Empacadoras Activas',
      value: activeFacilities,
      change: activeFacilities > 0 ? 'Registradas en el sistema' : 'Sin datos',
      changeType: 'neutral' as const,
      icon: Building2,
      color: 'blue'
    },
    {
      title: 'Pronóstico Semanal',
      value: totalForecastedBoxes.toLocaleString(),
      change: 'cajas estimadas',
      changeType: 'neutral' as const,
      icon: Package,
      color: 'green'
    },
    {
      title: 'Producción Real',
      value: totalActualBoxes.toLocaleString(),
      change: 'cajas producidas',
      changeType: 'neutral' as const,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Precisión Promedio',
      value: averageAccuracy === null ? '0.0%' : `${averageAccuracy.toFixed(1)}%`,
      change: averageAccuracy === null ? 'Sin datos' : (averageAccuracy > 90 ? 'Alta precision' : 'Con datos'),
      changeType: (averageAccuracy !== null && averageAccuracy > 90 ? 'positive' : 'neutral') as const,
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className="flex items-center space-x-1">
                  {stat.changeType === 'positive' && (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  )}
                  {stat.changeType === 'negative' && (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : stat.changeType === 'negative'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-lg flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
