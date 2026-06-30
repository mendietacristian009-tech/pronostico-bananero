import { useState, useEffect, useRef } from 'react';
import { FileText, Download, Printer, Calendar, BarChart3 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
import Button from '../components/common/Button';
import { useDataStore } from '../stores/dataStore';
import { formatShortDate, getLast12Weeks } from '../utils/dateUtils';
import { FacilityProductionData, WeeklyProductionData } from '../types/data';

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

const Reports = () => {
  const { facilities, boxRecords, forecasts, loading, fetchFacilities, fetchBoxRecords, fetchForecasts } = useDataStore();
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('all');
  const [reportType, setReportType] = useState<'weekly' | 'forecast'>('weekly');
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [],
  });
  const chartRef = useRef<any>(null);

  useEffect(() => {
    fetchFacilities();
    fetchBoxRecords();
    fetchForecasts();
  }, [fetchFacilities, fetchBoxRecords, fetchForecasts]);

  useEffect(() => {
    if (facilities.length > 0 && forecasts.length > 0 && boxRecords.length > 0) {
      prepareChartData();
    }
  }, [facilities, forecasts, boxRecords, selectedFacilityId, reportType]);

  const prepareChartData = () => {
    if (reportType === 'weekly') {
      prepareWeeklyProductionData();
    } else {
      prepareForecastAccuracyData();
    }
  };

  const prepareWeeklyProductionData = () => {
    const weeks = getLast12Weeks();
    const datasets: any[] = [];
    
    // If "all" is selected, show each facility as a separate line
    if (selectedFacilityId === 'all') {
      const facilityData: Record<string, number[]> = {};
      
      // Initialize data for each facility
      facilities.forEach(facility => {
        facilityData[facility.id] = Array(weeks.length).fill(0);
      });
      
      // Aggregate box counts by facility and week
      boxRecords.forEach(record => {
        const weekIndex = weeks.findIndex(week => 
          record.date >= week.startDate && record.date <= week.endDate
        );
        
        if (weekIndex >= 0 && facilityData[record.facilityId]) {
          facilityData[record.facilityId][weekIndex] += record.boxCount;
        }
      });
      
      // Create a dataset for each facility
      facilities.forEach((facility, index) => {
        const colors = [
          'rgb(46, 125, 50)',
          'rgb(25, 118, 210)',
          'rgb(255, 143, 0)',
          'rgb(156, 39, 176)',
          'rgb(244, 67, 54)',
          'rgb(0, 150, 136)',
        ];
        
        datasets.push({
          label: facility.name,
          data: facilityData[facility.id],
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.5)'),
          tension: 0.3,
        });
      });
    } else {
      // Show only the selected facility's data
      const selectedFacility = facilities.find(f => f.id === selectedFacilityId);
      if (!selectedFacility) return;
      
      const weeklyData = Array(weeks.length).fill(0);
      
      boxRecords
        .filter(record => record.facilityId === selectedFacilityId)
        .forEach(record => {
          const weekIndex = weeks.findIndex(week => 
            record.date >= week.startDate && record.date <= week.endDate
          );
          
          if (weekIndex >= 0) {
            weeklyData[weekIndex] += record.boxCount;
          }
        });
      
      datasets.push({
        label: selectedFacility.name,
        data: weeklyData,
        borderColor: 'rgb(46, 125, 50)',
        backgroundColor: 'rgba(46, 125, 50, 0.5)',
        tension: 0.3,
      });
    }
    
    setChartData({
      labels: weeks.map(w => w.label),
      datasets,
    });
  };

  const prepareForecastAccuracyData = () => {
    const weeks = getLast12Weeks();
    const datasets: any[] = [];
    
    // If "all" is selected, show each facility as a separate line
    if (selectedFacilityId === 'all') {
      const facilityAccuracy: Record<string, (number | null)[]> = {};
      
      // Initialize data for each facility
      facilities.forEach(facility => {
        facilityAccuracy[facility.id] = Array(weeks.length).fill(null);
      });
      
      // Set accuracy values for each facility and week
      forecasts
        .filter(forecast => forecast.accuracy !== undefined)
        .forEach(forecast => {
          const weekIndex = weeks.findIndex(week => 
            forecast.weekStartDate === week.startDate
          );
          
          if (weekIndex >= 0 && facilityAccuracy[forecast.facilityId]) {
            facilityAccuracy[forecast.facilityId][weekIndex] = forecast.accuracy;
          }
        });
      
      // Create a dataset for each facility
      facilities.forEach((facility, index) => {
        const colors = [
          'rgb(46, 125, 50)',
          'rgb(25, 118, 210)',
          'rgb(255, 143, 0)',
          'rgb(156, 39, 176)',
          'rgb(244, 67, 54)',
          'rgb(0, 150, 136)',
        ];
        
        datasets.push({
          label: facility.name,
          data: facilityAccuracy[facility.id],
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.5)'),
          tension: 0.3,
        });
      });
    } else {
      // Show only the selected facility's data
      const selectedFacility = facilities.find(f => f.id === selectedFacilityId);
      if (!selectedFacility) return;
      
      const accuracyData = Array(weeks.length).fill(null);
      
      forecasts
        .filter(forecast => 
          forecast.facilityId === selectedFacilityId && 
          forecast.accuracy !== undefined
        )
        .forEach(forecast => {
          const weekIndex = weeks.findIndex(week => 
            forecast.weekStartDate === week.startDate
          );
          
          if (weekIndex >= 0) {
            accuracyData[weekIndex] = forecast.accuracy;
          }
        });
      
      datasets.push({
        label: `Precisión de ${selectedFacility.name}`,
        data: accuracyData,
        borderColor: 'rgb(25, 118, 210)',
        backgroundColor: 'rgba(25, 118, 210, 0.5)',
        tension: 0.3,
      });
    }
    
    setChartData({
      labels: weeks.map(w => w.label),
      datasets,
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    const title = reportType === 'weekly' 
      ? 'Reporte de Producción Semanal' 
      : 'Reporte de Precisión de Pronósticos';
    
    doc.setFontSize(18);
    doc.text(title, 105, 15, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 105, 22, { align: 'center' });
    
    // Add facility
    const facilityText = selectedFacilityId === 'all' 
      ? 'Todas las empacadoras' 
      : `Empacadora: ${facilities.find(f => f.id === selectedFacilityId)?.name || ''}`;
    
    doc.text(facilityText, 105, 28, { align: 'center' });
    
    // Add image of chart
    if (chartRef.current) {
      const chartImage = chartRef.current.toBase64Image();
      doc.addImage(chartImage, 'PNG', 15, 35, 180, 100);
    }
    
    // Add table data
    const tableData: string[][] = [];
    
    if (reportType === 'weekly') {
      // Add weekly production data
      const weeks = getLast12Weeks();
      
      if (selectedFacilityId === 'all') {
        // Create a row for each facility
        facilities.forEach(facility => {
          const row = [facility.name];
          
          weeks.forEach(week => {
            const weekRecords = boxRecords.filter(record => 
              record.facilityId === facility.id &&
              record.date >= week.startDate && 
              record.date <= week.endDate
            );
            
            const totalBoxes = weekRecords.reduce((sum, record) => sum + record.boxCount, 0);
            row.push(totalBoxes.toString());
          });
          
          tableData.push(row);
        });
      } else {
        // Create rows for the selected facility
        const selectedFacility = facilities.find(f => f.id === selectedFacilityId);
        if (selectedFacility) {
          weeks.forEach(week => {
            const weekRecords = boxRecords.filter(record => 
              record.facilityId === selectedFacilityId &&
              record.date >= week.startDate && 
              record.date <= week.endDate
            );
            
            const totalBoxes = weekRecords.reduce((sum, record) => sum + record.boxCount, 0);
            
            tableData.push([
              week.label,
              totalBoxes.toString()
            ]);
          });
        }
      }
    } else {
      // Add forecast accuracy data
      const weeks = getLast12Weeks();
      
      if (selectedFacilityId === 'all') {
        // Create a row for each facility
        facilities.forEach(facility => {
          const row = [facility.name];
          
          weeks.forEach(week => {
            const weekForecast = forecasts.find(forecast => 
              forecast.facilityId === facility.id &&
              forecast.weekStartDate === week.startDate
            );
            
            row.push(weekForecast?.accuracy !== undefined ? `${weekForecast.accuracy}%` : 'N/A');
          });
          
          tableData.push(row);
        });
      } else {
        // Create rows for the selected facility
        const selectedFacility = facilities.find(f => f.id === selectedFacilityId);
        if (selectedFacility) {
          weeks.forEach(week => {
            const weekForecast = forecasts.find(forecast => 
              forecast.facilityId === selectedFacilityId &&
              forecast.weekStartDate === week.startDate
            );
            
            tableData.push([
              week.label,
              weekForecast?.accuracy !== undefined ? `${weekForecast.accuracy}%` : 'N/A',
              weekForecast?.predictedBoxes !== undefined ? weekForecast.predictedBoxes.toString() : 'N/A',
              weekForecast?.actualBoxes !== undefined ? weekForecast.actualBoxes.toString() : 'N/A'
            ]);
          });
        }
      }
    }
    
    // Add the table
    const tableHeaders = selectedFacilityId === 'all'
      ? ['Empacadora', ...getLast12Weeks().map(w => w.label)]
      : reportType === 'weekly'
        ? ['Semana', 'Cajas Producidas']
        : ['Semana', 'Precisión', 'Pronóstico', 'Real'];
    
    autoTable(doc, {
      startY: 145,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [46, 125, 50],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 8,
      },
    });
    
    // Save the PDF
    const pdfName = `${title.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(pdfName);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in" id="report-container">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-600">Genere y exporte reportes de producción y pronósticos</p>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de reporte
              </label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as 'weekly' | 'forecast')}
                className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="weekly">Producción Semanal</option>
                <option value="forecast">Precisión de Pronósticos</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="facilityId" className="block text-sm font-medium text-gray-700 mb-1">
                Empacadora
              </label>
              <select
                id="facilityId"
                value={selectedFacilityId}
                onChange={(e) => setSelectedFacilityId(e.target.value)}
                className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="all">Todas las empacadoras</option>
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              leftIcon={<Printer size={16} />}
              onClick={handlePrint}
            >
              Imprimir
            </Button>
            <Button
              variant="primary"
              leftIcon={<Download size={16} />}
              onClick={generatePDF}
            >
              Exportar PDF
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <p className="text-center py-4">Cargando datos...</p>
      ) : (
        <Card>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {reportType === 'weekly' ? (
              <>
                <Calendar size={20} className="mr-2 text-primary-600" />
                Producción Semanal
              </>
            ) : (
              <>
                <BarChart3 size={20} className="mr-2 text-primary-600" />
                Precisión de Pronósticos
              </>
            )}
          </h2>
          
          <div className="h-96">
            <Line
              ref={chartRef}
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
                    title: {
                      display: true,
                      text: reportType === 'weekly' ? 'Cajas Producidas' : 'Precisión (%)',
                    },
                  },
                  x: {
                    ticks: {
                      maxRotation: 45,
                      minRotation: 45,
                    },
                    title: {
                      display: true,
                      text: 'Semana',
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

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Datos tabulares</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {selectedFacilityId === 'all' ? (
                      <>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Empacadora
                        </th>
                        {getLast12Weeks().map((week, idx) => (
                          <th key={idx} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {week.label}
                          </th>
                        ))}
                      </>
                    ) : reportType === 'weekly' ? (
                      <>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Semana
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cajas Producidas
                        </th>
                      </>
                    ) : (
                      <>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Semana
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precisión
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pronóstico
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Real
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedFacilityId === 'all' ? (
                    // Show data for all facilities
                    facilities.map((facility) => (
                      <tr key={facility.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {facility.name}
                        </td>
                        {getLast12Weeks().map((week, idx) => {
                          if (reportType === 'weekly') {
                            // Weekly production data
                            const weekRecords = boxRecords.filter(record => 
                              record.facilityId === facility.id &&
                              record.date >= week.startDate && 
                              record.date <= week.endDate
                            );
                            
                            const totalBoxes = weekRecords.reduce((sum, record) => sum + record.boxCount, 0);
                            
                            return (
                              <td key={idx} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {totalBoxes.toLocaleString()}
                              </td>
                            );
                          } else {
                            // Forecast accuracy data
                            const weekForecast = forecasts.find(forecast => 
                              forecast.facilityId === facility.id &&
                              forecast.weekStartDate === week.startDate
                            );
                            
                            return (
                              <td key={idx} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {weekForecast?.accuracy !== undefined ? `${weekForecast.accuracy}%` : '—'}
                              </td>
                            );
                          }
                        })}
                      </tr>
                    ))
                  ) : reportType === 'weekly' ? (
                    // Weekly data for selected facility
                    getLast12Weeks().map((week, idx) => {
                      const weekRecords = boxRecords.filter(record => 
                        record.facilityId === selectedFacilityId &&
                        record.date >= week.startDate && 
                        record.date <= week.endDate
                      );
                      
                      const totalBoxes = weekRecords.reduce((sum, record) => sum + record.boxCount, 0);
                      
                      return (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {week.label}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {totalBoxes.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    // Forecast data for selected facility
                    getLast12Weeks().map((week, idx) => {
                      const weekForecast = forecasts.find(forecast => 
                        forecast.facilityId === selectedFacilityId &&
                        forecast.weekStartDate === week.startDate
                      );
                      
                      return (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {week.label}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {weekForecast?.accuracy !== undefined ? `${weekForecast.accuracy}%` : '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {weekForecast?.predictedBoxes !== undefined ? weekForecast.predictedBoxes.toLocaleString() : '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {weekForecast?.actualBoxes !== undefined ? weekForecast.actualBoxes.toLocaleString() : '—'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reports;