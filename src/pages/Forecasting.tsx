import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Edit, TrendingUp, FileCheck, AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useDataStore } from '../stores/dataStore';
import { getWeekRange } from '../utils/dateUtils';
import { ForecastWithFacility } from '../types/data';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ForecastUpdateFormData = {
  forecastId: string;
  actualBoxes: number;
};

const Forecasting = () => {
  const { facilities, forecasts, loading, error, fetchFacilities, fetchForecasts, updateForecastActual } = useDataStore();
  const [editingForecast, setEditingForecast] = useState<string | null>(null);
  const [actualBoxes, setActualBoxes] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchFacilities();
    fetchForecasts();
  }, [fetchFacilities, fetchForecasts]);

  // Format forecasts with facility names
  const forecastsWithFacilities: ForecastWithFacility[] = forecasts.map(forecast => {
    const facility = facilities.find(f => f.id === forecast.facilityId);
    return {
      ...forecast,
      facility: {
        name: facility?.name || 'Desconocida'
      }
    };
  });

  // Group forecasts by week for display
  const forecastsByWeek = forecastsWithFacilities.reduce((acc, forecast) => {
    const weekKey = forecast.weekStartDate;
    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(forecast);
    return acc;
  }, {} as Record<string, ForecastWithFacility[]>);

  // Sort weeks in descending order
  const sortedWeeks = Object.keys(forecastsByWeek).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const handleEditClick = (forecastId: string, currentValue?: number) => {
    setEditingForecast(forecastId);
    setActualBoxes(currentValue || 0);
  };

  const handleSaveActual = async (forecastId: string) => {
    if (actualBoxes > 0) {
      await updateForecastActual(forecastId, actualBoxes);
      setEditingForecast(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingForecast(null);
    setActualBoxes(0);
  };

  // Prepare data for the chart
  const prepareChartData = (weekForecasts: ForecastWithFacility[]) => {
    const labels = weekForecasts.map(f => f.facility.name);
    const predictedData = weekForecasts.map(f => f.predictedBoxes);
    const actualData = weekForecasts.map(f => f.actualBoxes || 0);
    
    const hasActualData = weekForecasts.some(f => f.actualBoxes !== undefined);
    
    return {
      labels,
      datasets: [
        {
          label: 'Pronóstico',
          data: predictedData,
          backgroundColor: 'rgba(25, 118, 210, 0.7)',
          borderColor: 'rgba(25, 118, 210, 1)',
          borderWidth: 1,
        },
        ...(hasActualData ? [{
          label: 'Real',
          data: actualData,
          backgroundColor: 'rgba(46, 125, 50, 0.7)',
          borderColor: 'rgba(46, 125, 50, 1)',
          borderWidth: 1,
        }] : []),
      ],
    };
  };

  const getAccuracyBadgeColor = (accuracy?: number) => {
    if (accuracy === undefined) return 'bg-gray-100 text-gray-600';
    if (accuracy >= 90) return 'bg-success-100 text-success-800';
    if (accuracy >= 70) return 'bg-warning-100 text-warning-800';
    return 'bg-error-100 text-error-800';
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pronósticos</h1>
          <p className="text-gray-600">Visualice y actualice pronósticos semanales</p>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-success-50 border-l-4 border-success-500 p-4 mb-6 animate-slide-up">
          <div className="flex">
            <div className="flex-shrink-0">
              <FileCheck className="h-5 w-5 text-success-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-success-700">
                El pronóstico ha sido actualizado correctamente.
              </p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <p className="text-center py-4">Cargando pronósticos...</p>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {sortedWeeks.map(week => {
          const weekForecasts = forecastsByWeek[week];
          const chartData = prepareChartData(weekForecasts);
          const weekRange = getWeekRange(week);
          
          return (
            <Card key={week} className="overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex items-center">
                  <TrendingUp size={20} className="text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold">Semana: {weekRange}</h3>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="text-sm text-gray-500">
                    {weekForecasts.some(f => f.actualBoxes !== undefined) 
                      ? 'Datos reales disponibles' 
                      : 'Pendiente de actualización'
                    }
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="h-80">
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            mode: 'index',
                            intersect: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                          x: {
                            ticks: {
                              maxRotation: 45,
                              minRotation: 45,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium mb-3">Detalles por empacadora</h4>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {weekForecasts.map(forecast => (
                      <div key={forecast.id} className="border rounded-md p-3 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium text-gray-900">{forecast.facility.name}</h5>
                          {forecast.accuracy !== undefined && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccuracyBadgeColor(forecast.accuracy)}`}>
                              {forecast.accuracy}% precisión
                            </span>
                          )}
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Pronóstico</p>
                            <p className="font-semibold">{forecast.predictedBoxes.toLocaleString()} cajas</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Real</p>
                            {editingForecast === forecast.id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={actualBoxes}
                                  onChange={(e) => setActualBoxes(parseInt(e.target.value) || 0)}
                                  min="0"
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                />
                              </div>
                            ) : (
                              <p className="font-semibold">
                                {forecast.actualBoxes !== undefined
                                  ? `${forecast.actualBoxes.toLocaleString()} cajas`
                                  : '—'}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {editingForecast === forecast.id ? (
                          <div className="mt-3 flex space-x-2">
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="xs"
                              variant="primary"
                              onClick={() => handleSaveActual(forecast.id)}
                            >
                              Guardar
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <Button
                              size="xs"
                              variant="outline"
                              leftIcon={<Edit size={14} />}
                              onClick={() => handleEditClick(forecast.id, forecast.actualBoxes)}
                            >
                              {forecast.actualBoxes !== undefined ? 'Editar real' : 'Registrar real'}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {sortedWeeks.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay pronósticos disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecasting;