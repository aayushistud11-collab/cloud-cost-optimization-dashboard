import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import CostAnalytics from "./pages/CostAnalytics";
import Recommendations from "./pages/Recommendations";
import Performance from "./pages/Performance";
import Carbon from "./pages/Carbon";
import Simulator from "./pages/Simulator";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import About from "./pages/About";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const authed = sessionStorage.getItem("cloudopti_auth") === "true";
  return authed ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="resources" element={<Resources />} />
          <Route path="cost-analytics" element={<CostAnalytics />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="performance" element={<Performance />} />
          <Route path="carbon" element={<Carbon />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
