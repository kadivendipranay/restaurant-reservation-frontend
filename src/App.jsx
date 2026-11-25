import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AIChatbot from "./components/AIChatbot";
import FoodRecommendations from "./pages/FoodRecommendations";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="USER">
              <UserPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/food-recommendations"
          element={<FoodRecommendations />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AIChatbot />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;