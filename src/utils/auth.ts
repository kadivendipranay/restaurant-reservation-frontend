
import { jwtDecode } from "jwt-decode";

type Role = "ADMIN" | "USER";

type JwtPayload = {
  role: Role;
  exp: number;
};

export const getSession = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (
      !decoded.exp ||
      decoded.exp * 1000 <= Date.now() ||
      !["ADMIN", "USER"].includes(decoded.role)
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return null;
    }

    return {
      token,
      role: decoded.role,
    };
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
