import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Root → auto redirect based on auth */}
      <Route path="/" element={<Home />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* User Dashboard */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRole="USER">
            <UserPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
