import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Shield, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserData {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'engineer' | 'warehouse';
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export function UsersView() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    role: 'engineer' as 'admin' | 'engineer' | 'warehouse',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (editingUser) {
      // Update user
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, username: formData.username, name: formData.name, role: formData.role }
          : u
      ));
      setEditingUser(null);
    } else {
      // Add new user
      const newUser: UserData = {
        id: Date.now().toString(),
        username: formData.username,
        name: formData.name,
        role: formData.role,
        active: true,
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
    }

    setFormData({ username: '', name: '', role: 'engineer', password: '', confirmPassword: '' });
    setShowAddForm(false);
  };

  const handleEdit = (userData: UserData) => {
    setEditingUser(userData);
    setFormData({
      username: userData.username,
      name: userData.name,
      role: userData.role,
      password: '',
      confirmPassword: ''
    });
    setShowAddForm(true);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, active: !u.active } : u
    ));
  };

  const deleteUser = (id: string) => {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'engineer': return 'Ingeniero Agrónomo';
      case 'warehouse': return 'Encargado de Almacén';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'engineer': return 'bg-blue-100 text-blue-800';
      case 'warehouse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <p className="text-yellow-800">Solo los administradores pueden gestionar usuarios.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-500 mt-1">Administrar usuarios y permisos del sistema</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingUser(null);
            setFormData({ username: '', name: '', role: 'engineer', password: '', confirmPassword: '' });
          }}
          className="flex w-full items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Add/Edit User Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
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
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="engineer">Ingeniero Agrónomo</option>
                  <option value="warehouse">Encargado de Almacén</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña {editingUser && '(dejar vacío para mantener actual)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required={!editingUser}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required={!editingUser || formData.password !== ''}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:space-x-3 sm:gap-0">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors sm:w-auto"
              >
                {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingUser(null);
                }}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Usuarios del Sistema</h3>
          <p className="text-sm text-gray-500">Total: {users.length} usuarios</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acceso
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userData) => (
                <tr key={userData.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{userData.name}</div>
                        <div className="text-sm text-gray-500">@{userData.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(userData.role)}`}>
                      {getRoleLabel(userData.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {userData.active ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-green-800">Activo</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm text-red-800">Inactivo</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userData.lastLogin 
                      ? new Date(userData.lastLogin).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Nunca'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(userData)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Editar usuario"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(userData.id)}
                        className={`transition-colors ${
                          userData.active 
                            ? 'text-yellow-600 hover:text-yellow-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={userData.active ? 'Desactivar usuario' : 'Activar usuario'}
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                      {userData.id !== user?.id && (
                        <button
                          onClick={() => deleteUser(userData.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
