export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  ENGINEER = 'engineer',
  STAFF = 'staff'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
  loading: boolean;
  error: string | null;
}