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

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.clear();
      return null;
    }

    return {
      token,
      role: decoded.role,
    };
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.clear();
};
