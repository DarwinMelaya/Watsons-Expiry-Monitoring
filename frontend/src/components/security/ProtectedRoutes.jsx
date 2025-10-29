import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  // Only show loading during initial app load, not after login
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#019e97]">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
