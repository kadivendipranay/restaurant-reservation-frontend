import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type Role = "ADMIN" | "USER";

type Props = {
  children: ReactNode;
  allowedRole?: Role;
};

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
