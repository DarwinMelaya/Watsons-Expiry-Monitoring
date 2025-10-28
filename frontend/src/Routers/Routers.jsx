import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login, Dashboard, Monitoring } from "../pages";
import Layout from "../components/layout/Layout";
import ProtectedRoutes from "../components/security/ProtectedRoutes";

export const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/monitoring" element={<Monitoring />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
