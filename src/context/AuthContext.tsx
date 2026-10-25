
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

type Role = "ADMIN" | "USER";

type JwtPayload = {
  role: Role;
  exp: number;
};

type AuthContextType = {
  token: string | null;
  role: Role | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getValidSession = (storedToken: string) => {
  try {
    const decoded = jwtDecode<JwtPayload>(storedToken);

    if (
      !decoded.exp ||
      decoded.exp * 1000 <= Date.now() ||
      !["ADMIN", "USER"].includes(decoded.role)
    ) {
      return null;
    }

    return {
      token: storedToken,
      role: decoded.role,
    };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) return;

    const session = getValidSession(storedToken);

    if (!session) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return;
    }

    setToken(session.token);
    setRole(session.role);
  }, []);

  const login = (newToken: string) => {
    const session = getValidSession(newToken);

    if (!session) {
      throw new Error("Invalid or expired login token.");
    }

    localStorage.setItem("token", session.token);
    localStorage.setItem("role", session.role);

    setToken(session.token);
    setRole(session.role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
};
