import { useState, useEffect } from 'react';
import { CalendarIcon, Plus, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useDataStore } from '../stores/dataStore';
import { useAuthStore } from '../stores/authStore';
import { formatShortDate } from '../utils/dateUtils';

type BoxRecordFormData = {
  facilityId: string;
  date: string;
  boxCount: number;
};

const DataEntry = () => {
  const { user } = useAuthStore();
  const { facilities, boxRecords, loading, error, fetchFacilities, fetchBoxRecords, addBoxRecord } = useDataStore();
  const [isAdding, setIsAdding] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BoxRecordFormData>({
    defaultValues: {
      facilityId: '',
      date: new Date().toISOString().split('T')[0],
      boxCount: 0
    }
  });

  useEffect(() => {
    fetchFacilities();
    fetchBoxRecords();
  }, [fetchFacilities, fetchBoxRecords]);

  const onSubmit = async (data: BoxRecordFormData) => {
    await addBoxRecord({
      ...data,
      boxCount: Number(data.boxCount),
      createdBy: user?.id || ''
    });
    
    reset();
    setIsAdding(false);
    setSubmitSuccess(true);
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };

  const cancelAdd = () => {
    setIsAdding(false);
    reset();
  };

  // Group records by date for display
  const recordsByDate = boxRecords.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = [];
    }
    acc[record.date].push(record);
    return acc;
  }, {} as Record<string, typeof boxRecords>);

  // Sort dates in descending order
  const sortedDates = Object.keys(recordsByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registro de Cajas</h1>
          <p className="text-gray-600">Ingrese la cantidad de cajas empacadas por día</p>
        </div>
        {!isAdding && (
          <Button 
            variant="primary" 
            leftIcon={<Plus size={16} />}
            onClick={() => setIsAdding(true)}
            className="mt-4 sm:mt-0"
          >
            Nuevo registro
          </Button>
        )}
      </div>

      {submitSuccess && (
        <div className="bg-success-50 border-l-4 border-success-500 p-4 mb-6 animate-slide-up">
          <div className="flex">
            <div className="flex-shrink-0">
              <Save className="h-5 w-5 text-success-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-success-700">
                El registro se ha guardado correctamente.
              </p>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <Card className="mb-6 animate-slide-up">
          <h3 className="text-lg font-semibold mb-4">Nuevo registro de cajas</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="facilityId" className="block text-sm font-medium text-gray-700 mb-1">
                  Empacadora
                </label>
                <select
                  id="facilityId"
                  className={`block w-full rounded-md border ${
                    errors.facilityId ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  {...register('facilityId', { required: 'Seleccione una empacadora' })}
                >
                  <option value="">Seleccionar empacadora</option>
                  {facilities
                    .filter(f => f.active)
                    .map((facility) => (
                      <option key={facility.id} value={facility.id}>
                        {facility.name}
                      </option>
                    ))}
                </select>
                {errors.facilityId && (
                  <p className="mt-1 text-sm text-red-600">{errors.facilityId.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.date ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    max={new Date().toISOString().split('T')[0]}
                    {...register('date', { required: 'Fecha es requerida' })}
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="boxCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad de cajas
                </label>
                <input
                  type="number"
                  id="boxCount"
                  min="1"
                  className={`block w-full rounded-md border ${
                    errors.boxCount ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  {...register('boxCount', { 
                    required: 'Cantidad es requerida',
                    min: { value: 1, message: 'La cantidad debe ser mayor a 0' },
                    valueAsNumber: true
                  })}
                />
                {errors.boxCount && (
                  <p className="mt-1 text-sm text-red-600">{errors.boxCount.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline"
                leftIcon={<X size={16} />}
                onClick={cancelAdd}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                leftIcon={<Save size={16} />}
                isLoading={loading}
              >
                Guardar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading && !isAdding && (
        <p className="text-center py-4">Cargando registros...</p>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {sortedDates.map(date => (
          <Card key={date}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CalendarIcon size={18} className="mr-2 text-gray-500" />
              {formatShortDate(date)}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empacadora
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cajas
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registrado por
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recordsByDate[date].map(record => {
                    const facility = facilities.find(f => f.id === record.facilityId);
                    return (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {facility?.name || 'Desconocida'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.boxCount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* In a real app, you would have user data to display here */}
                          Administrador
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ))}

        {sortedDates.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay registros disponibles.</p>
            {!isAdding && (
              <Button 
                variant="primary" 
                leftIcon={<Plus size={16} />} 
                onClick={() => setIsAdding(true)}
                className="mt-4"
              >
                Añadir primer registro
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataEntry;