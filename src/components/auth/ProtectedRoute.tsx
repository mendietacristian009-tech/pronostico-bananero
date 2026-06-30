import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Loading from '../common/Loading';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, initialized, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!initialized) {
      checkAuth();
    }
  }, [checkAuth, initialized]);

  if (!initialized) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;