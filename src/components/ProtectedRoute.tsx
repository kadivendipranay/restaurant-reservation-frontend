
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { getSession } from "../utils/auth";

type Role = "ADMIN" | "USER";

type Props = {
  children: ReactNode;
  allowedRole?: Role;
};

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { token, role, logout } = useAuth();

  const session = token ? getSession() : null;

  if (!session || session.token !== token) {
    if (token) logout();
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
