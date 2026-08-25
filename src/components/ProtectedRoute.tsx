import { Navigate, Outlet } from 'react-router';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('token'); 

  if (!token) {
    return <Navigate to="/registration" replace />;
  }

  return <Outlet />;
};
