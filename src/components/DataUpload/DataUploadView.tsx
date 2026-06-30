import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Calendar, Package, Building2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

export function DataUploadView() {
  const { facilities, forecasts, updateActualProduction } = useData();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [manualData, setManualData] = useState({
    facilityId: '',
    week: '',
    year: new Date().getFullYear().toString(),
    actualBoxes: ''
  });

  // Get pending forecasts (without actual production data)
  const pendingForecasts = forecasts.filter(f => f.actualBoxes === undefined);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadStatus('processing');
    setUploadMessage('Procesando archivo...');

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful upload
      setUploadStatus('success');
      setUploadMessage(`Archivo "${file.name}" procesado exitosamente. Se actualizaron 5 registros de producción.`);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setSelectedFile(null);
        setUploadMessage('');
      }, 3000);
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage('Error al procesar el archivo. Verifique el formato y vuelva a intentar.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const forecast = forecasts.find(f => 
      f.facilityId === manualData.facilityId && 
      f.week === parseInt(manualData.week) && 
      f.year === parseInt(manualData.year)
    );

    if (forecast) {
      updateActualProduction(forecast.id, parseInt(manualData.actualBoxes));
      setManualData({ facilityId: '', week: '', year: new Date().getFullYear().toString(), actualBoxes: '' });
      setUploadMessage('Datos actualizados exitosamente');
      setTimeout(() => setUploadMessage(''), 3000);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <p className="text-yellow-800">Solo los administradores pueden cargar datos de producción.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Carga de Datos de Producción</h2>
        <p className="text-gray-500 mt-1">Cargar datos reales de producción para comparar con pronósticos</p>
      </div>

      {/* Manual Data Entry */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-start sm:items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Carga Manual de Datos</h3>
            <p className="text-sm text-gray-500">Ingresar datos de producción individualmente</p>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empacadora
              </label>
              <select
                value={manualData.facilityId}
                onChange={(e) => setManualData(prev => ({ ...prev, facilityId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar empacadora...</option>
                {facilities.filter(f => f.active).map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semana
              </label>
              <input
                type="number"
                min="1"
                max="53"
                value={manualData.week}
                onChange={(e) => setManualData(prev => ({ ...prev, week: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: 15"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año
              </label>
              <input
                type="number"
                min="2023"
                max="2030"
                value={manualData.year}
                onChange={(e) => setManualData(prev => ({ ...prev, year: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cajas Producidas
              </label>
              <input
                type="number"
                min="0"
                value={manualData.actualBoxes}
                onChange={(e) => setManualData(prev => ({ ...prev, actualBoxes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: 1250"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Guardar Datos
          </button>
        </form>

        {uploadMessage && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">{uploadMessage}</p>
          </div>
        )}
      </div>

      {/* Pending Forecasts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-start sm:items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Calendar className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pronósticos Pendientes</h3>
            <p className="text-sm text-gray-500">Pronósticos que requieren datos de producción real</p>
          </div>
        </div>

        {pendingForecasts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-500">No hay pronósticos pendientes de actualizar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empacadora
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semana
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pronóstico
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingForecasts.slice(0, 10).map((forecast) => (
                  <tr key={forecast.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{forecast.facilityName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      S{forecast.week}/{forecast.year}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {forecast.weekStart} - {forecast.weekEnd}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {forecast.forecastedBoxes.toLocaleString()} cajas
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Pendiente
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* File Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-start sm:items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Upload className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Carga Masiva de Datos</h3>
            <p className="text-sm text-gray-500">Subir archivo Excel o CSV con datos de producción</p>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={uploadStatus === 'processing'}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-medium text-gray-900 break-words">
                  {selectedFile ? selectedFile.name : 'Seleccionar archivo'}
                </p>
                <p className="text-sm text-gray-500">
                  Formatos soportados: Excel (.xlsx, .xls) y CSV
                </p>
              </div>
            </div>
          </label>
        </div>

        {uploadStatus !== 'idle' && (
          <div className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
            uploadStatus === 'success' ? 'bg-green-50 border border-green-200' :
            uploadStatus === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            {uploadStatus === 'processing' && (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            )}
            {uploadStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {uploadStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            <p className={`text-sm ${
              uploadStatus === 'success' ? 'text-green-800' :
              uploadStatus === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {uploadMessage}
            </p>
          </div>
        )}

        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Formato del archivo:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• <strong>Columna A:</strong> Nombre de la empacadora</p>
            <p>• <strong>Columna B:</strong> Semana (número)</p>
            <p>• <strong>Columna C:</strong> Año</p>
            <p>• <strong>Columna D:</strong> Cajas producidas (número)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
