
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type Role = "ADMIN" | "USER";

type Props = {
  children: ReactNode;
  allowedRole?: Role;
};

export default function ProtectedRoute({
  children,
  allowedRole,
}: Props) {
  const { token, role } = useAuth();
  const location = useLocation();

  // Authentication validation
  if (!token || !role) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Role-based authorization
  if (allowedRole && role !== allowedRole) {
    return (
      <Navigate
        to={role === "ADMIN" ? "/admin" : "/user"}
        replace
      />
    );
  }

  return <>{children}</>;
}
