/* eslint-disable react/prop-types */
import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({allowedRolse}) => {
  const { auth } = useAuth();
  console.log('requireAuth', auth);
  const location = useLocation();
  
  return (
    auth?.roles?.find(role => allowedRolse?.includes(role))
        ? <Outlet />
        : auth?.username
          ? <Navigate to="/unauthorized" state={{from: location}} replace />
          :<Navigate to="/login" state={{from: location}} replace />
  );
}

export default RequireAuth;