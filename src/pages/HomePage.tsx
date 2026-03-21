import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/HomePage.css";

const FEATURES = [
  "User Login & Register",
  "Create Reservations",
  "Time Slot Selection",
  "Cancel Reservations",
  "Admin Dashboard",
  "Restore Cancelled Bookings",
];

export default function HomePage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase();

  const goDashboard = () => {
    if (!token) return navigate("/login");
    return navigate(role === "ADMIN" ? "/admin" : "/user");
  };

  return (
    <div className="home-container">
      <Navbar />

      {/* HERO */}
      <section className="hero-card">
        <h1 className="hero-title">🍽️ Welcome to ReserveDine</h1>

        <p className="hero-subtitle">
          Book your table instantly. Manage reservations effortlessly.
        </p>

        <button className="hero-btn" onClick={goDashboard}>
          Go to Dashboard →
        </button>
      </section>

      {/* ABOUT */}
      <section className="about-card">
        <h2>About Our Restaurant</h2>
        <p>
          ReserveDine makes dining stress-free. Whether you are a guest
          booking a table or an admin managing reservations — everything
          happens in one place.
        </p>
      </section>

      {/* FEATURES */}
      <section className="features-grid">
        {FEATURES.map((feature) => (
          <div key={feature} className="feature-card">
            <h4>{feature}</h4>
            <p>Smooth and secure experience</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>Built with ❤️ using React + Node + MongoDB</p>
        <p>© {new Date().getFullYear()} ReserveDine</p>
      </footer>
    </div>
  );
}