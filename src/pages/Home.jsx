import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

const FEATURES = [
  "Online Reservations",
  "Admin Dashboard",
  "Time Slot Booking",
  "Cancel / Restore",
  "Role Based Login",
  "JWT Secure Auth",
];

export default function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase();

  const goDashboard = () => {
    if (!token) return navigate("/login");
    return navigate(role === "ADMIN" ? "/admin" : "/user");
  };

  return (
    <div className="home">
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">🍽 Royal Restaurant</h1>

          <p className="hero-subtitle">
            Fine dining • Easy reservations • Premium experience
          </p>

          <button className="hero-btn" onClick={goDashboard}>
            Book a Table →
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="features-grid">
          {FEATURES.map((feature) => (
            <div key={feature} className="feature-card">
              <h3>{feature}</h3>
              <p>Professional full-stack implementation</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        © 2026 Royal Restaurant • Built by Pranay Kumar (MERN Stack)
      </footer>
    </div>
  );
}