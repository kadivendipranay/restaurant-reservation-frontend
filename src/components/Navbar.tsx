import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let userRole = (localStorage.getItem("role") || "").toUpperCase();

  // ✅ decode token safely (role from token is most correct)
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      userRole = (decoded.role || userRole || "USER").toUpperCase();
    } catch (err) {
      console.log("JWT Decode error:", err);
    }
  }

  const handleLogout = () => {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;

    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h3 onClick={() => navigate("/")}>Restaurant Reservation</h3>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* ✅ show role */}
        {token && (
          <span>
            Role: <b>{userRole}</b>
          </span>
        )}

        {/* ✅ buttons */}
        <div className="navbar-buttons">
          {token && userRole === "USER" && (
            <button onClick={() => navigate("/user")}>User Dashboard</button>
          )}

          {token && userRole === "ADMIN" && (
            <button onClick={() => navigate("/admin")}>Admin Dashboard</button>
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
