import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login, Dashboard, Monitoring, Maintenance } from "../pages";
import Layout from "../components/layout/Layout";
import ProtectedRoutes from "../components/security/ProtectedRoutes";
import IntroLoading from "../components/IntroLoading";
import LoginWithIntro from "../pages/auth/LoginWithIntro";

export const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/intro" element={<IntroLoading navigateTo="/login" />} />
        <Route path="/login" element={<LoginWithIntro />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/maintenance" element={<Maintenance />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/intro" replace />} />
        <Route path="*" element={<Navigate to="/intro" replace />} />
      </Routes>
    </Router>
  );
};
