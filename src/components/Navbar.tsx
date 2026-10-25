
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth();

  const handleLogout = () => {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;

    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="navbar">
      <h3 onClick={() => navigate("/")}>Restaurant Reservation</h3>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {token && role && (
          <span>
            Role: <b>{role}</b>
          </span>
        )}

        <div className="navbar-buttons">
          {token && role === "USER" && (
            <button onClick={() => navigate("/user")}>
              User Dashboard
            </button>
          )}

          {token && role === "ADMIN" && (
            <button onClick={() => navigate("/admin")}>
              Admin Dashboard
            </button>
          )}

          {!token ? (
            <button onClick={() => navigate("/login")}>Login</button>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      </div>
    </div>
  );
}
