import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type Role = 'owner' | 'cashier';

type ProtectedRouteProps = {
  allowedRoles?: Role[];
  redirectTo?: string;
};

export const ProtectedRoute = ({
  allowedRoles = [],
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => (
  <ProtectedRoute allowedRoles={['owner']} redirectTo="/login" />
);

export const StaffRoute = () => (
  <ProtectedRoute allowedRoles={['owner', 'cashier']} redirectTo="/login" />
);

export const CustomerRoute = () => (
  <ProtectedRoute redirectTo="/login" />
);
