
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

type Role = "ADMIN" | "USER";

type JwtPayload = {
  role: Role;
  exp: number;
};

type Session = {
  token: string;
  role: Role;
  expiresAt: number;
};

type AuthContextType = {
  token: string | null;
  role: Role | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

const TOKEN_KEY = "token";
const ROLE_KEY = "role";

function getValidSession(
  storedToken: string
): Session | null {
  try {
    const decoded = jwtDecode<JwtPayload>(storedToken);

    if (
      !Number.isFinite(decoded.exp) ||
      decoded.exp * 1000 <= Date.now() ||
      !["ADMIN", "USER"].includes(decoded.role)
    ) {
      return null;
    }

    return {
      token: storedToken,
      role: decoded.role,
      expiresAt: decoded.exp * 1000,
    };
  } catch {
    return null;
  }
}

function clearStoredSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  } catch {
    // Storage unavailable
  }
}

function loadSession(): Session | null {
  try {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    return storedToken
      ? getValidSession(storedToken)
      : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [session, setSession] =
    useState<Session | null>(loadSession);

  // Remove invalid or expired stored sessions
  useEffect(() => {
    if (!session) {
      clearStoredSession();
    }
  }, [session]);

  // Automatically expire the current session
  useEffect(() => {
    if (!session) return;

    let timer: ReturnType<typeof setTimeout>;

    const checkExpiration = () => {
      const remaining =
        session.expiresAt - Date.now();

      if (remaining <= 0) {
        clearStoredSession();
        setSession(null);
        return;
      }

      timer = setTimeout(
        checkExpiration,
        Math.min(remaining, 2147483647)
      );
    };

    checkExpiration();

    return () => clearTimeout(timer);
  }, [session]);

  // Synchronize login/logout across browser tabs
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === TOKEN_KEY ||
        event.key === null
      ) {
        setSession(loadSession());
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  const login = (newToken: string) => {
    const validSession = getValidSession(newToken);

    if (!validSession) {
      throw new Error(
        "Invalid or expired login token."
      );
    }

    try {
      localStorage.setItem(
        TOKEN_KEY,
        validSession.token
      );

      localStorage.setItem(
        ROLE_KEY,
        validSession.role
      );
    } catch {
      clearStoredSession();

      throw new Error(
        "Unable to save login session."
      );
    }

    setSession(validSession);
  };

  const logout = () => {
    clearStoredSession();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token: session?.token ?? null,
        role: session?.role ?? null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
  