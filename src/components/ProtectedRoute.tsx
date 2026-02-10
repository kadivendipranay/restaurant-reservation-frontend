import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getSession } from "../utils/auth";

type Role = "ADMIN" | "USER";

type Props = {
  children: ReactNode;
  allowedRole?: Role;
};

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && session.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
