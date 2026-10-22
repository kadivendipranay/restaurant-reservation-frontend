
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AIChatbot from "./components/AIChatbot";
import FoodRecommendations from "./pages/FoodRecommendations";

function App() {
  return (
    <>
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

        {/* Food Recommendations */}
        <Route
          path="/food-recommendations"
          element={<FoodRecommendations />}
        />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

      {/* Floating chatbot */}
      <AIChatbot />

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </>
  );
}

export default App;
