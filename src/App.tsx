import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      {/* ROUTES */}
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* User */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="USER">
              <UserPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* 🔥 TOAST CONTAINER */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;