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
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const stored = localStorage.getItem("token");

    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(stored);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        setLoading(false);
        return;
      }

      setToken(stored);
      setRole(decoded.role);
    } catch {
      localStorage.clear();
    }

    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    const decoded = jwtDecode<JwtPayload>(newToken);

    setToken(newToken);
    setRole(decoded.role);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);

  if (ctx === undefined) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
};
