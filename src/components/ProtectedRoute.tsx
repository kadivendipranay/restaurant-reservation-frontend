import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
  allowedRole?: "ADMIN" | "USER";
};

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase();

  // ✅ if no token → go login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ role check only if allowedRole is given
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
