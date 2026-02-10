import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type Role = "ADMIN" | "USER";

type Props = {
  children: ReactNode;
  allowedRole?: Role;
};

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toUpperCase() as Role | null;

  // No token → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // No role found → logout
  if (!role) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
