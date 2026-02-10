import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/user" replace />;
}
