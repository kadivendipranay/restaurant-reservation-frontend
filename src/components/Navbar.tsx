
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (!confirmed) return;

    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <h3
        className="navbar-brand"
        onClick={() => navigate("/")}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            navigate("/");
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Restaurant Reservation home"
      >
        <span className="navbar-brand-accent" aria-hidden="true" />
        Restaurant Reservation
      </h3>

      <div className="navbar-right">
        {token && role && (
          <span className="navbar-role">
            Role: <b>{role}</b>
          </span>
        )}

        <nav className="navbar-buttons" aria-label="Main navigation">
          {token && role === "USER" && (
            <button
              type="button"
              onClick={() => navigate("/user")}
            >
              User Dashboard
            </button>
          )}

          {token && role === "ADMIN" && (
            <button
              type="button"
              onClick={() => navigate("/admin")}
            >
              Admin Dashboard
            </button>
          )}

          {!token ? (
            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
