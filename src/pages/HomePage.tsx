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
    <div className="container">
      <Navbar />

      {/* Hero Section */}
      <div
        className="card"
        style={{
          padding: "40px",
          marginBottom: "30px",
          background:
            "linear-gradient(135deg, #ff512f, #dd2476)",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>
          🍽️ Welcome to ReserveDine
        </h1>

        <p style={{ fontSize: "18px", opacity: 0.9 }}>
          Book your table instantly. Manage reservations effortlessly.
        </p>

        <button
          onClick={goDashboard}
          style={{
            marginTop: "20px",
            padding: "12px 22px",
            borderRadius: "25px",
            border: "none",
            background: "white",
            color: "#dd2476",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Go to Dashboard →
        </button>
      </div>

      {/* About Section */}
      <div
        className="card"
        style={{
          padding: "25px",
          marginBottom: "25px",
        }}
      >
        <h2>About Our Restaurant</h2>

        <p style={{ lineHeight: 1.6 }}>
          ReserveDine makes dining stress-free. Whether you are a guest
          booking a table or an admin managing reservations — everything
          happens in one place.
        </p>
      </div>

      {/* Features */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {[
          "User Login & Register",
          "Create Reservations",
          "Time Slot Selection",
          "Cancel Reservations",
          "Admin Dashboard",
          "Restore Cancelled Bookings",
        ].map((feature) => (
          <div
            key={feature}
            className="card"
            style={{
              padding: "20px",
              borderRadius: "16px",
              background: "#fafafa",
              textAlign: "center",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>{feature}</h4>
            <p style={{ fontSize: "14px", color: "#666" }}>
              Smooth and secure experience
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "40px",
          textAlign: "center",
          color: "#777",
        }}
      >
        <p>Built with ❤️ using React + Node + MongoDB</p>
        <p style={{ fontSize: "14px" }}>
          © {new Date().getFullYear()} ReserveDine
        </p>
      </div>
    </div>
  );
}
