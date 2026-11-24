import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function Navbar() {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const activeToken = token || localStorage.getItem("token");
  const normalizedRole = (role || localStorage.getItem("role") || "").toUpperCase();
  const isAuthenticated = Boolean(activeToken);

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

  const goToSection = (sectionId: string) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
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
        <button type="button" className="nav-link-btn" onClick={() => navigate("/")}>
          <Home size={14} className="link-symbol" aria-hidden="true" />
          <span>Home</span>
        </button>

        <button type="button" className="nav-link-btn" onClick={() => goToSection("features")}>
          <Sparkles size={14} className="link-symbol" aria-hidden="true" />
          <span>Features</span>
        </button>

        <button
          type="button"
          className="nav-link-btn"
          onClick={() => navigate("/food-recommendations")}
        >
          <UtensilsCrossed size={14} className="link-symbol" aria-hidden="true" />
          <span>Food Recommendations</span>
        </button>

        <button type="button" className="nav-link-btn" onClick={() => goToSection("benefits")}>
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