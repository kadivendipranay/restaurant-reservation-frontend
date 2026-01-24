import { Navigate } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role === "ADMIN") {
    return <Navigate to="/admin" />;
  }

  return <Navigate to="/user" />;
}
