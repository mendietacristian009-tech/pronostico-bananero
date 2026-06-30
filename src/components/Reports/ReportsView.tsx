import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, BarChart3 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';

export function ReportsView() {
  const { forecasts, facilities } = useData();
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [dateRange, setDateRange] = useState('last-4-weeks');
  const [reportType, setReportType] = useState('all');

  const filterForecasts = () => {
    let filtered = forecasts;

    // Filter by facility
    if (selectedFacility !== 'all') {
      filtered = filtered.filter(f => f.facilityId === selectedFacility);
    }

    // Filter by date range
    const now = new Date();
    switch (dateRange) {
      case 'last-week':
        filtered = filtered.filter(f => {
          const weekStart = new Date(f.weekStart);
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return weekStart >= weekAgo;
        });
        break;
      case 'last-4-weeks':
        filtered = filtered.filter(f => {
          const weekStart = new Date(f.weekStart);
          const monthAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
          return weekStart >= monthAgo;
        });
        break;
      case 'last-3-months':
        filtered = filtered.filter(f => {
          const weekStart = new Date(f.weekStart);
          const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          return weekStart >= threeMonthsAgo;
        });
        break;
    }

    // Filter by report type
    if (reportType === 'with-actual') {
      filtered = filtered.filter(f => f.actualBoxes !== undefined);
    } else if (reportType === 'pending') {
      filtered = filtered.filter(f => f.actualBoxes === undefined);
    }

    return filtered.sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());
  };

  const filteredForecasts = filterForecasts();

  const handleExportPDF = () => {
    const title = `Reporte de Pronósticos - ${new Date().toLocaleDateString('es-ES')}`;
    exportToPDF(filteredForecasts, title);
  };

  const handleExportExcel = () => {
    const filename = `pronosticos-${new Date().toISOString().split('T')[0]}`;
    exportToExcel(filteredForecasts, filename);
  };

  const calculateStats = () => {
    const withActual = filteredForecasts.filter(f => f.actualBoxes !== undefined);
    const totalForecasted = filteredForecasts.reduce((sum, f) => sum + f.forecastedBoxes, 0);
    const totalActual = withActual.reduce((sum, f) => sum + (f.actualBoxes || 0), 0);
    const avgAccuracy = withActual.length > 0 
      ? withActual.reduce((sum, f) => sum + (f.accuracy || 0), 0) / withActual.length 
      : 0;

    return { totalForecasted, totalActual, avgAccuracy, recordsWithActual: withActual.length };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reportes y Exportación</h2>
          <p className="text-gray-500 mt-1">Generar reportes oficiales y análisis de datos</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:space-x-3 sm:gap-0">
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros de Reporte</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Empacadora
            </label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todas las empacadoras</option>
              {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>
                  {facility.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período de Tiempo
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="last-week">Última semana</option>
              <option value="last-4-weeks">Últimas 4 semanas</option>
              <option value="last-3-months">Últimos 3 meses</option>
              <option value="all">Todos los registros</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Reporte
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos los pronósticos</option>
              <option value="with-actual">Con producción real</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registros</p>
              <p className="text-2xl font-bold text-gray-900">{filteredForecasts.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cajas Pronosticadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalForecasted.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cajas Reales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalActual.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Precisión Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgAccuracy.toFixed(1)}%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Datos del Reporte ({filteredForecasts.length} registros)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredForecasts.slice(0, 20).map((forecast) => (
                <tr key={forecast.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {forecast.facilityName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    S{forecast.week}/{forecast.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {forecast.weekStart} - {forecast.weekEnd}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {forecast.forecastedBoxes.toLocaleString()} cajas
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {forecast.actualBoxes ? `${forecast.actualBoxes.toLocaleString()} cajas` : 'Pendiente'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {forecast.accuracy ? `${forecast.accuracy.toFixed(1)}%` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredForecasts.length > 20 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Mostrando 20 de {filteredForecasts.length} registros. Exporte para ver todos los datos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
