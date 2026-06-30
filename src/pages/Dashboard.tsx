import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Box, BarChart3 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import Card from '../components/common/Card';
import { useDataStore } from '../stores/dataStore';
import { useAuthStore } from '../stores/authStore';
import { formatShortDate, getWeekRange } from '../utils/dateUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuthStore();
  const { facilities, boxRecords, forecasts, loading, fetchFacilities, fetchBoxRecords, fetchForecasts } = useDataStore();
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Fetch data on component mount
    fetchFacilities();
    fetchBoxRecords();
    fetchForecasts();
  }, [fetchFacilities, fetchBoxRecords, fetchForecasts]);

  useEffect(() => {
    if (boxRecords.length > 0 && facilities.length > 0) {
      // Process data for the last 30 days chart
      const lastThirtyDays = [...boxRecords]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 30)
        .reverse();

      // Group by date
      const groupedByDate = lastThirtyDays.reduce((acc, record) => {
        const date = record.date;
        if (!acc[date]) {
          acc[date] = { date, totalBoxes: 0 };
        }
        acc[date].totalBoxes += record.boxCount;
        return acc;
      }, {} as Record<string, { date: string; totalBoxes: number }>);

      // Convert to array and sort by date
      const dateData = Object.values(groupedByDate).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Create chart data
      setChartData({
        labels: dateData.map(d => formatShortDate(d.date)),
        datasets: [
          {
            label: 'Cajas totales',
            data: dateData.map(d => d.totalBoxes),
            borderColor: 'rgb(46, 125, 50)',
            backgroundColor: 'rgba(46, 125, 50, 0.5)',
            borderWidth: 2,
            tension: 0.3,
            pointBackgroundColor: 'rgb(46, 125, 50)',
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      });
    }
  }, [boxRecords, facilities]);

  // Calculate totals and performance metrics
  const calculateMetrics = () => {
    if (!boxRecords.length || !forecasts.length) return null;

    // Get total boxes packed (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const last7DaysRecords = boxRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= sevenDaysAgo && recordDate <= today;
    });

    const totalBoxesLast7Days = last7DaysRecords.reduce((sum, record) => sum + record.boxCount, 0);

    // Get previous 7 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 14);

    const previous7DaysRecords = boxRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= fourteenDaysAgo && recordDate < sevenDaysAgo;
    });

    const totalBoxesPrevious7Days = previous7DaysRecords.reduce((sum, record) => sum + record.boxCount, 0);
    
    // Calculate week-over-week change
    const weekOverWeekChange = totalBoxesPrevious7Days 
      ? ((totalBoxesLast7Days - totalBoxesPrevious7Days) / totalBoxesPrevious7Days) * 100
      : 0;

    // Get most productive facility (last 30 days)
    const last30DaysRecords = boxRecords.filter(record => {
      const recordDate = new Date(record.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      return recordDate >= thirtyDaysAgo;
    });

    const facilityProduction = last30DaysRecords.reduce((acc, record) => {
      if (!acc[record.facilityId]) {
        acc[record.facilityId] = 0;
      }
      acc[record.facilityId] += record.boxCount;
      return acc;
    }, {} as Record<string, number>);

    let mostProductiveFacilityId = '';
    let maxProduction = 0;

    Object.entries(facilityProduction).forEach(([facilityId, production]) => {
      if (production > maxProduction) {
        mostProductiveFacilityId = facilityId;
        maxProduction = production;
      }
    });

    const mostProductiveFacility = facilities.find(f => f.id === mostProductiveFacilityId);

    // Get forecast accuracy for completed weeks
    const completedForecasts = forecasts.filter(f => f.actualBoxes !== undefined);
    
    const averageAccuracy = completedForecasts.length
      ? completedForecasts.reduce((sum, forecast) => sum + (forecast.accuracy || 0), 0) / completedForecasts.length
      : 0;

    // Current week forecast
    const currentDate = new Date();
    const currentWeekStart = new Date(currentDate);
    const day = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const diff = currentDate.getDate() - day;
    currentWeekStart.setDate(diff); // set to Sunday of current week

    const currentWeekForecasts = forecasts.filter(forecast => {
      const forecastStart = new Date(forecast.weekStartDate);
      return forecastStart.getTime() === currentWeekStart.getTime();
    });

    const totalForecastCurrentWeek = currentWeekForecasts.reduce(
      (sum, forecast) => sum + forecast.predictedBoxes, 
      0
    );

    return {
      totalBoxesLast7Days,
      weekOverWeekChange,
      mostProductiveFacility: mostProductiveFacility?.name || 'N/A',
      mostProductiveFacilityProduction: maxProduction,
      averageAccuracy,
      totalForecastCurrentWeek
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bienvenido, {user?.name}</p>
        </div>
      </div>

      {loading && <p className="text-center py-4">Cargando datos...</p>}

      {!loading && metrics && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="p-2 rounded-md bg-primary-100 text-primary-800">
                  <Box size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Cajas (7 días)</p>
                  <h3 className="text-xl font-bold text-gray-900">{metrics.totalBoxesLast7Days.toLocaleString()}</h3>
                  <div className="flex items-center mt-1">
                    {metrics.weekOverWeekChange > 0 ? (
                      <>
                        <TrendingUp size={16} className="text-success-600" />
                        <span className="text-xs font-medium text-success-600 ml-1">
                          +{Math.abs(metrics.weekOverWeekChange).toFixed(1)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown size={16} className="text-error-600" />
                        <span className="text-xs font-medium text-error-600 ml-1">
                          {Math.abs(metrics.weekOverWeekChange).toFixed(1)}%
                        </span>
                      </>
                    )}
                    <span className="text-xs text-gray-500 ml-1">vs. semana anterior</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="p-2 rounded-md bg-secondary-100 text-secondary-800">
                  <BarChart3 size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pronóstico semanal</p>
                  <h3 className="text-xl font-bold text-gray-900">{metrics.totalForecastCurrentWeek.toLocaleString()}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">
                      Semana actual
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="p-2 rounded-md bg-success-100 text-success-800">
                  <TrendingUp size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Precisión pronóstico</p>
                  <h3 className="text-xl font-bold text-gray-900">{metrics.averageAccuracy.toFixed(1)}%</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">
                      Promedio histórico
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="p-2 rounded-md bg-accent-100 text-accent-800">
                  <Box size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Empacadora líder</p>
                  <h3 className="text-lg font-bold text-gray-900">{metrics.mostProductiveFacility}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {metrics.mostProductiveFacilityProduction.toLocaleString()} cajas (30 días)
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Producción de cajas (Últimos 30 días)</h3>
              <div className="h-80">
                <Line
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
                        ticks: {
                          font: {
                            size: 11,
                          },
                        },
                      },
                      x: {
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45,
                          font: {
                            size: 10,
                          },
                        },
                      },
                    },
                    interaction: {
                      mode: 'nearest',
                      axis: 'x',
                      intersect: false,
                    },
                  }}
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Próximos pronósticos</h3>
              <div className="space-y-4">
                {forecasts
                  .filter(f => !f.actualBoxes) // Only show forecasts without actual values
                  .sort((a, b) => new Date(a.weekStartDate).getTime() - new Date(b.weekStartDate).getTime())
                  .slice(0, 5)
                  .map(forecast => {
                    const facility = facilities.find(f => f.id === forecast.facilityId);
                    return (
                      <div key={forecast.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{facility?.name}</h4>
                          <p className="text-sm text-gray-500">{getWeekRange(forecast.weekStartDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-primary-600">{forecast.predictedBoxes.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">cajas estimadas</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {forecasts.filter(f => !f.actualBoxes).length === 0 && (
                <p className="text-center text-gray-500 py-4">No hay pronósticos pendientes</p>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;