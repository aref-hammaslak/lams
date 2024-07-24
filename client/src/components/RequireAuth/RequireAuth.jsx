import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  console.log('requireAuth', auth);
  const location = useLocation();
  
  return (
    auth?.username
        ? <Outlet />
        : <Navigate to="/login" state={{from: location}} replace />
  );
}

export default RequireAuth;