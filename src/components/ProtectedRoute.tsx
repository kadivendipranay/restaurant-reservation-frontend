import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type Role = "ADMIN" | "USER";

type Props = {
  children: ReactNode;
  allowedRole?: Role;
};

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const token = localStorage.getItem("token");
  const rawRole = localStorage.getItem("role");

  const role = rawRole?.toUpperCase() as Role | undefined;

  // No token → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Invalid or missing role → clear session
  if (!role || (role !== "ADMIN" && role !== "USER")) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
