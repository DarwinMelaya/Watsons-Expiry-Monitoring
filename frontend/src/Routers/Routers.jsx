import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Dashboard, Monitoring } from "../pages";
import Layout from "../components/layout/Layout";

export const Routers = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/monitoring" element={<Monitoring />} />
        </Route>
      </Routes>
    </Router>
  );
};
