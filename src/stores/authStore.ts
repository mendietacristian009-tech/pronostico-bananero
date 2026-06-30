import { create } from 'zustand';
import { AuthState, User, UserRole } from '../types/auth';

// Mock data for demonstration - in real app, would be from API
const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@bananaforescast.com', role: UserRole.ADMIN, password: 'admin123' },
  { id: '2', name: 'Manager User', email: 'manager@bananaforescast.com', role: UserRole.MANAGER, password: 'manager123' },
  { id: '3', name: 'Engineer User', email: 'engineer@bananaforescast.com', role: UserRole.ENGINEER, password: 'engineer123' },
  { id: '4', name: 'Staff User', email: 'staff@bananaforescast.com', role: UserRole.STAFF, password: 'staff123' },
];

export const useAuthStore = create<AuthState & {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}>((set) => ({
  user: null,
  isAuthenticated: false,
  initialized: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching credentials
      const user = mockUsers.find(u => 
        u.email === email && u.password === password
      );
      
      if (user) {
        // Remove password before storing in state
        const { password: _, ...userWithoutPassword } = user;
        
        set({ 
          user: userWithoutPassword, 
          isAuthenticated: true, 
          loading: false,
          error: null
        });
        
        // Save to local storage
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        return true;
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          loading: false,
          error: 'Credenciales inválidas'
        });
        return false;
      }
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false,
        error: 'Error al iniciar sesión'
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ 
      user: null, 
      isAuthenticated: false,
      error: null
    });
  },

  checkAuth: () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser) as User;
      set({ 
        user, 
        isAuthenticated: true,
        initialized: true
      });
    } else {
      set({ initialized: true });
    }
  }
}));

// Initialize auth state on app load
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuth();
}