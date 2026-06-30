import React, { useState } from 'react';
import { Building2, MapPin, Edit, Trash2, Plus, AlertCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

export function FacilityList() {
  const { facilities, addFacility, updateFacility } = useData();
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFacility(formData);
    setFormData({ name: '', location: '', active: true });
    setShowAddForm(false);
  };

  const toggleFacilityStatus = (id: string, currentStatus: boolean) => {
    updateFacility(id, { active: !currentStatus });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-800">Solo los administradores pueden gestionar empacadoras.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Empacadoras</h2>
          <p className="text-gray-500 mt-1">Administrar las empacadoras del sistema</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex w-full items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Empacadora</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nueva Empacadora</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Empacadora
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Empacadora activa
              </label>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:space-x-3 sm:gap-0">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors sm:w-auto"
              >
                Agregar Empacadora
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className={`bg-white rounded-xl shadow-sm border p-4 sm:p-6 transition-all hover:shadow-md ${
              facility.active ? 'border-gray-200' : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex min-w-0 items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  facility.active ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Building2 className={`h-6 w-6 ${
                    facility.active ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">{facility.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{facility.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Estado:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  facility.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {facility.active ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Creada:</span>
                <span className="text-sm text-gray-900">
                  {new Date(facility.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => toggleFacilityStatus(facility.id, facility.active)}
                className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  facility.active
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {facility.active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
