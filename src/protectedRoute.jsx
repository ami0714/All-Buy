import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/authContext';

function ProtectedRoute({ allowedRoles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div role="status">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/home'} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;