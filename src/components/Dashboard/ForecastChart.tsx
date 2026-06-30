import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../../contexts/DataContext';

export function ForecastChart() {
  const { forecasts } = useData();

  // Get last 8 weeks of data
  const chartData = forecasts
    .filter(f => f.actualBoxes !== undefined)
    .sort((a, b) => new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime())
    .slice(-8)
    .map(f => ({
      week: `S${f.week}`,
      facility: f.facilityName,
      forecasted: f.forecastedBoxes,
      actual: f.actualBoxes,
      date: f.weekStart
    }));

  // Group by week for stacked view
  const groupedData = chartData.reduce((acc, item) => {
    const existing = acc.find(d => d.week === item.week);
    if (existing) {
      existing.forecasted += item.forecasted;
      existing.actual += (item.actual || 0);
    } else {
      acc.push({
        week: item.week,
        forecasted: item.forecasted,
        actual: item.actual || 0
      });
    }
    return acc;
  }, [] as any[]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">Pronósticos vs Producción Real</h3>
          <p className="text-sm text-gray-500">Últimas 8 semanas - Todas las empacadoras</p>
        </div>
      </div>
      
      <div className="h-72 sm:h-80 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} cajas`,
                name === 'forecasted' ? 'Pronóstico' : 'Real'
              ]}
              labelFormatter={(label) => `Semana ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="forecasted" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              name="Pronóstico"
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              name="Real"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
