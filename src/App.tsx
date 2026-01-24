import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";

function App() {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase();

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Home Redirect */}
        <Route path="/" element={<Home />} />

        {/* ✅ Login */}
        <Route path="/login" element={<Login />} />

        {/* ✅ Admin Route */}
        <Route
          path="/admin"
          element={
            token && role === "ADMIN" ? <AdminPage /> : <Navigate to="/login" />
          }
        />

        {/* ✅ User Route */}
        <Route
          path="/user"
          element={
            token && role === "USER" ? <UserPage /> : <Navigate to="/login" />
          }
        />

        {/* ✅ fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
