import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

const FEATURES = [
  {
    title: "🍽 Online Reservations",
    desc: "Users can easily book tables by selecting date, time slot, and number of guests.",
  },
  {
    title: "📊 Admin Dashboard",
    desc: "Admin can view, manage, cancel, and restore all reservations in one place.",
  },
  {
    title: "⏰ Time Slot Booking",
    desc: "Predefined time slots ensure organized scheduling and avoid booking conflicts.",
  },
  {
    title: "❌ Cancel / Restore",
    desc: "Reservations can be cancelled by users or restored by admin when needed.",
  },
  {
    title: "👤 Role Based Login",
    desc: "System redirects users to admin or user dashboard based on their role.",
  },
  {
    title: "🔐 JWT Secure Auth",
    desc: "Authentication is handled using JWT tokens for secure and protected access.",
  },
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
            <div key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        © {new Date().getFullYear()} Royal Restaurant • Built by Pranay Kumar (MERN Stack)
      </footer>
    </div>
  );
}