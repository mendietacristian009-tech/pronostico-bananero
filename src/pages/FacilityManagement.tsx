import React, { useEffect, useState } from 'react';
import { useDataStore } from '../stores/dataStore';
import { Facility, BoxRecord, Forecast } from '../types/data';

function FacilityManagement() {
  const {
    facilities,
    boxRecords,
    forecasts,
    loading,
    fetchFacilities,
    fetchBoxRecords,
    fetchForecasts,
    addFacility,
    updateFacility,
  } = useDataStore();

  const [showModal, setShowModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [form, setForm] = useState({ name: '', location: '', active: true });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFacilities();
    fetchBoxRecords();
    fetchForecasts();
  }, [fetchFacilities, fetchBoxRecords, fetchForecasts]);

  const handleOpenModal = (facility?: Facility) => {
    setError('');
    if (facility) {
      setEditingFacility(facility);
      setForm({ name: facility.name, location: facility.location, active: facility.active });
    } else {
      setEditingFacility(null);
      setForm({ name: '', location: '', active: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFacility(null);
    setForm({ name: '', location: '', active: true });
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim()) {
      setError('Nombre y ubicación son requeridos');
      return;
    }
    if (editingFacility) {
      await updateFacility(editingFacility.id, form);
    } else {
      await addFacility(form);
    }
    handleCloseModal();
  };

  const handleToggleActive = async (facility: Facility) => {
    await updateFacility(facility.id, { active: !facility.active });
  };

  // Filtrar registros y pronósticos por empacadora seleccionada
  const facilityRecords = selectedFacility
    ? boxRecords.filter(r => r.facilityId === selectedFacility.id)
    : [];
  const facilityForecasts = selectedFacility
    ? forecasts.filter(f => f.facilityId === selectedFacility.id)
    : [];

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Empacadoras</h1>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">Gestione las empacadoras y consulte sus registros y pronósticos.</p>
        <button
          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          onClick={() => handleOpenModal()}
        >
          Nueva empacadora
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha de alta</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {facilities.map(facility => (
              <tr key={facility.id} className={selectedFacility?.id === facility.id ? 'bg-primary-50' : ''}>
                <td className="px-4 py-2 font-medium text-gray-900 cursor-pointer" onClick={() => setSelectedFacility(facility)}>
                  {facility.name}
                </td>
                <td className="px-4 py-2 text-gray-700">{facility.location}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${facility.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {facility.active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-500">{new Date(facility.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="text-primary-600 hover:underline" onClick={() => handleOpenModal(facility)}>Editar</button>
                  <button className="text-gray-500 hover:underline" onClick={() => handleToggleActive(facility)}>
                    {facility.active ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
            {facilities.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">No hay empacadoras registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar/editar empacadora */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">{editingFacility ? 'Editar empacadora' : 'Nueva empacadora'}</h2>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Ubicación</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={e => setForm({ ...form, active: e.target.checked })}
                  id="active"
                />
                <label htmlFor="active" className="text-sm">Activa</label>
              </div>
              {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detalle de empacadora seleccionada */}
      {selectedFacility && (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">{selectedFacility.name} - Detalle</h2>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Registros históricos de cajas</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cajas</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facilityRecords.map(record => (
                    <tr key={record.id}>
                      <td className="px-4 py-2">{record.date}</td>
                      <td className="px-4 py-2">{record.boxCount}</td>
                    </tr>
                  ))}
                  {facilityRecords.length === 0 && (
                    <tr>
                      <td colSpan={2} className="text-center py-4 text-gray-400">No hay registros.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Pronósticos semanales</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Semana</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pronóstico</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Real</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precisión</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facilityForecasts.map(forecast => (
                    <tr key={forecast.id}>
                      <td className="px-4 py-2">{forecast.weekStartDate} - {forecast.weekEndDate}</td>
                      <td className="px-4 py-2">{forecast.predictedBoxes}</td>
                      <td className="px-4 py-2">{forecast.actualBoxes !== undefined ? forecast.actualBoxes : '—'}</td>
                      <td className="px-4 py-2">{forecast.accuracy !== undefined ? `${forecast.accuracy}%` : '—'}</td>
                    </tr>
                  ))}
                  {facilityForecasts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-400">No hay pronósticos.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacilityManagement;