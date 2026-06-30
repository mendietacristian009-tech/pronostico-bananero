import { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuthStore } from '../stores/authStore';
import { User, UserRole } from '../types/auth';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { user: currentUser } = useAuthStore();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.STAFF,
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers: User[] = [];
      
      setUsers(mockUsers);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los usuarios');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingUserId) {
        // Update existing user
        setUsers(users.map(user => 
          user.id === editingUserId 
            ? { ...user, name: formData.name, email: formData.email, role: formData.role }
            : user
        ));
      } else {
        // Add new user
        const newUser: User = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        setUsers([...users, newUser]);
      }
      
      resetForm();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setError('Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
    });
    setEditingUserId(user.id);
    setIsAdding(true);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(users.filter(user => user.id !== userId));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setError('Error al eliminar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: UserRole.STAFF,
      password: ''
    });
    setEditingUserId(null);
    setIsAdding(false);
  };

  const getRoleName = (role: UserRole) => {
    const roleNames = {
      [UserRole.ADMIN]: 'Administrador',
      [UserRole.MANAGER]: 'Gerente',
      [UserRole.ENGINEER]: 'Ingeniero',
      [UserRole.STAFF]: 'Personal'
    };
    return roleNames[role];
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      [UserRole.ADMIN]: 'bg-primary-100 text-primary-800',
      [UserRole.MANAGER]: 'bg-secondary-100 text-secondary-800',
      [UserRole.ENGINEER]: 'bg-accent-100 text-accent-800',
      [UserRole.STAFF]: 'bg-gray-100 text-gray-800'
    };
    return colors[role];
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administre los usuarios del sistema</p>
        </div>
        {!isAdding && (
          <Button
            variant="primary"
            leftIcon={<UserPlus size={16} />}
            onClick={() => setIsAdding(true)}
            className="mt-4 sm:mt-0"
          >
            Nuevo usuario
          </Button>
        )}
      </div>

      {showSuccess && (
        <div className="bg-success-50 border-l-4 border-success-500 p-4 mb-6 animate-slide-up">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-success-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-success-700">
                {editingUserId ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente'}
              </p>
            </div>
          </div>
        </div>
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

      {isAdding && (
        <Card className="mb-6 animate-slide-up">
          <h3 className="text-lg font-semibold mb-4">
            {editingUserId ? 'Editar usuario' : 'Nuevo usuario'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                >
                  <option value={UserRole.STAFF}>Personal</option>
                  <option value={UserRole.ENGINEER}>Ingeniero</option>
                  <option value={UserRole.MANAGER}>Gerente</option>
                  <option value={UserRole.ADMIN}>Administrador</option>
                </select>
              </div>

              {!editingUserId && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required={!editingUserId}
                    minLength={6}
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                leftIcon={<X size={16} />}
                onClick={resetForm}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Check size={16} />}
                isLoading={loading}
              >
                {editingUserId ? 'Guardar cambios' : 'Crear usuario'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correo electrónico
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="xs"
                        variant="outline"
                        leftIcon={<Edit2 size={14} />}
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </Button>
                      {user.id !== currentUser?.id && (
                        <Button
                          size="xs"
                          variant="danger"
                          leftIcon={<Trash2 size={14} />}
                          onClick={() => handleDelete(user.id)}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="text-center py-4">
              <p className="text-gray-500">Cargando usuarios...</p>
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No hay usuarios registrados.</p>
              {!isAdding && (
                <Button
                  variant="primary"
                  leftIcon={<UserPlus size={16} />}
                  onClick={() => setIsAdding(true)}
                  className="mt-4"
                >
                  Añadir primer usuario
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
