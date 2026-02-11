import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase();

  const goDashboard = () => {
    if (!token) navigate("/login");
    else if (role === "ADMIN") navigate("/admin");
    else navigate("/user");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)), url('https://images.unsplash.com/photo-1555992336-cbf0c4c1b6e4') center/cover",
      }}
    >
      <Navbar />

      {/* HERO */}
      <div
        style={{
          maxWidth: 1100,
          margin: "auto",
          padding: "120px 20px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: 56, marginBottom: 10 }}>🍽 Royal Restaurant</h1>

        <p style={{ fontSize: 22, opacity: 0.9 }}>
          Fine dining • Easy reservations • Premium experience
        </p>

        <button
          onClick={goDashboard}
          style={{
            marginTop: 35,
            padding: "14px 38px",
            borderRadius: 40,
            border: "none",
            fontSize: 18,
            fontWeight: "bold",
            background: "linear-gradient(135deg,#ff6a00,#ff005c)",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,.4)",
          }}
        >
          Book a Table →
        </button>
      </div>

      {/* FEATURES */}
      <div
        style={{
          background: "#fff",
          padding: "70px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 30,
          }}
        >
          {[
            "Online Reservations",
            "Admin Dashboard",
            "Time Slot Booking",
            "Cancel / Restore",
            "Role Based Login",
            "JWT Secure Auth",
          ].map((f) => (
            <div
              key={f}
              style={{
                padding: 30,
                borderRadius: 20,
                background: "#fafafa",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,.08)",
              }}
            >
              <h3 style={{ marginBottom: 10 }}>{f}</h3>
              <p style={{ color: "#666" }}>
                Professional full-stack implementation
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          background: "#111",
          color: "#aaa",
          textAlign: "center",
          padding: 25,
        }}
      >
        © 2026 Royal Restaurant • Built by Pranay Kumar (MERN Stack)
      </div>
    </div>
  );
}
