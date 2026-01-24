import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase();

  const goDashboard = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (role === "ADMIN") navigate("/admin");
    else navigate("/user");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Navbar />

      <h1>🍽️ Restaurant Reservation System</h1>
      <p style={{ fontSize: "18px" }}>
        Welcome! Book tables easily and manage reservations with Admin dashboard.
      </p>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={goDashboard}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Go to Dashboard →
        </button>
      </div>

      <hr style={{ margin: "25px 0" }} />

      <h3>✅ Features in this project</h3>
      <ul style={{ fontSize: "16px" }}>
        <li>User Login & Register</li>
        <li>Create Reservation (within 1 year)</li>
        <li>Time Slot selection</li>
        <li>Cancel Reservation</li>
        <li>Admin View All (Pagination + Filter)</li>
        <li>Admin Cancel + Restore reservation</li>
      </ul>
    </div>
  );
}
