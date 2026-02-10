import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fff3e0,#e3f2fd)",
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
          🍽️ Royal Restaurant
        </h1>

        <p style={{ fontSize: "20px", color: "#555" }}>
          Reserve your table instantly. Experience fine dining.
        </p>

        <button
          onClick={goDashboard}
          style={{
            marginTop: "30px",
            padding: "14px 30px",
            borderRadius: "30px",
            border: "none",
            fontSize: "18px",
            background: "linear-gradient(135deg,#ff6a00,#ff005c)",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
          }}
        >
          Book a Table →
        </button>

        {/* Features */}
        <div
          style={{
            marginTop: "70px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "25px",
          }}
        >
          {[
            "Online Reservations",
            "Admin Dashboard",
            "Time Slots",
            "Cancel / Restore",
            "Role Based Login",
            "Secure JWT Auth",
          ].map((f) => (
            <div
              key={f}
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "18px",
                boxShadow: "0 4px 12px rgba(0,0,0,.08)",
              }}
            >
              <h3>{f}</h3>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p style={{ marginTop: "80px", color: "#888" }}>
          Built by Pranay Kumar — Full Stack MERN Project
        </p>
      </div>
    </div>
  );
}
