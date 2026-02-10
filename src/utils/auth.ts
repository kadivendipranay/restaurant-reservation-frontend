import { jwtDecode } from "jwt-decode";

export type Role = "ADMIN" | "USER";

type JwtPayload = {
  role: Role;
  exp: number;
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getRole = (): Role | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Check token expiry
    if (decoded.exp * 1000 < Date.now()) {
      logout();
      return null;
    }

    if (decoded.role !== "ADMIN" && decoded.role !== "USER") {
      return null;
    }

    return decoded.role;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.clear();
};
