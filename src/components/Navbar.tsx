import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Utensils,
  Home,
  Sparkles,
  UtensilsCrossed,
  Info,
  ShieldCheck,
  LayoutDashboard,
  CalendarCheck2,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function safeGetStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { token, role, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const scrollTimerRef = useRef<number | null>(null);

  const activeToken = token || safeGetStorage("token");
  const normalizedRole = (role || safeGetStorage("role") || "").toUpperCase();
  const isAuthenticated = Boolean(activeToken);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    if (isLoggingOut) return;
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    setIsLoggingOut(true);
    logout();
    navigate("/login", { replace: true });
  };

  const handleBrandKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate("/");
    }
  };

  const scrollToTarget = (sectionId: string, fallbackId?: string) => {
    const el =
      document.getElementById(sectionId) ||
      (fallbackId ? document.getElementById(fallbackId) : null);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const goToSection = (sectionId: string, fallbackId?: string) => {
    if (pathname !== "/") {
      navigate("/");
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
      scrollTimerRef.current = window.setTimeout(() => {
        scrollToTarget(sectionId, fallbackId);
      }, 140);
      return;
    }
    scrollToTarget(sectionId, fallbackId);
  };

  return (
    <header className="navbar">
      <div
        className="navbar-brand"
        onClick={() => navigate("/")}
        onKeyDown={handleBrandKeyDown}
        role="button"
        tabIndex={0}
        aria-label="ReserveDine home"
      >
        <span className="navbar-brand-icon" aria-hidden="true">
          <Utensils size={16} />
        </span>
        <span className="navbar-brand-text">ReserveDine</span>
      </div>

      <nav className="navbar-center-links" aria-label="Section navigation">
        <button
          type="button"
          className={`nav-link-btn ${pathname === "/" ? "active-link" : ""}`}
          onClick={() => navigate("/")}
        >
          <Home size={14} className="link-symbol" aria-hidden="true" />
          <span>Home</span>
        </button>

        <button
          type="button"
          className="nav-link-btn"
          onClick={() => goToSection("features")}
        >
          <Sparkles size={14} className="link-symbol" aria-hidden="true" />
          <span>Features</span>
        </button>

        <button
          type="button"
          className={`nav-link-btn ${pathname === "/food-recommendations" ? "active-link" : ""}`}
          onClick={() => navigate("/food-recommendations")}
        >
          <UtensilsCrossed size={14} className="link-symbol" aria-hidden="true" />
          <span>Food Recommendations</span>
        </button>

        <button
          type="button"
          className="nav-link-btn"
          onClick={() => goToSection("benefits", "features")}
        >
          <Info size={14} className="link-symbol" aria-hidden="true" />
          <span>About</span>
        </button>
      </nav>

      <div className="navbar-right">
        {isAuthenticated && normalizedRole && (
          <span className="navbar-role">
            <ShieldCheck size={14} className="role-symbol" aria-hidden="true" />
            <span>Role:</span> <b>{normalizedRole}</b>
          </span>
        )}

        <div className="navbar-actions">
          {isAuthenticated && normalizedRole === "ADMIN" && (
            <button
              type="button"
              className="nav-dashboard-btn"
              onClick={() => navigate("/admin")}
            >
              <LayoutDashboard size={14} className="action-symbol" aria-hidden="true" />
              <span>Admin Dashboard</span>
            </button>
          )}

          {isAuthenticated && normalizedRole === "USER" && (
            <button
              type="button"
              className="nav-dashboard-btn"
              onClick={() => navigate("/user")}
            >
              <CalendarCheck2 size={14} className="action-symbol" aria-hidden="true" />
              <span>User Dashboard</span>
            </button>
          )}

          {!isAuthenticated ? (
            <>
              <button
                type="button"
                className="nav-login-btn"
                onClick={() => navigate("/login")}
              >
                <LogIn size={14} className="action-symbol" aria-hidden="true" />
                <span>Login</span>
              </button>
              <button
                type="button"
                className="nav-signup-btn"
                onClick={() => navigate("/register")}
              >
                <UserPlus size={14} className="action-symbol" aria-hidden="true" />
                <span>Sign Up</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="nav-logout-btn"
              disabled={isLoggingOut}
              onClick={handleLogout}
            >
              <LogOut size={14} className="action-symbol" aria-hidden="true" />
              <span>{isLoggingOut ? "Logging out…" : "Logout"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}