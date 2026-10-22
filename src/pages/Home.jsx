
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

const FEATURES = [
  {
    icon: "🍽️",
    title: "Online Reservations",
    desc: "Book your table by choosing a date, time slot, and number of guests.",
  },
  {
    icon: "📊",
    title: "Admin Dashboard",
    desc: "Administrators can view, manage, cancel, and restore reservations.",
  },
  {
    icon: "⏰",
    title: "Time Slot Booking",
    desc: "Choose an available time slot for an organized booking experience.",
  },
  {
    icon: "🔄",
    title: "Reservation Management",
    desc: "Users can cancel eligible bookings, while admins can manage reservation statuses.",
  },
  {
    icon: "👤",
    title: "Role-Based Access",
    desc: "Users and administrators are directed to their respective dashboards.",
  },
  {
    icon: "🔐",
    title: "JWT Authentication",
    desc: "Protected API endpoints use authentication and role-based authorization.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const goDashboard = () => {
    const token = localStorage.getItem("token");
    const role = (localStorage.getItem("role") || "").toUpperCase();

    if (!token) {
      navigate("/login");
      return;
    }

    if (role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  const goToLogin = () => navigate("/login");

  const goToFoodRecommendations = () =>
    navigate("/food-recommendations");

  return (
    <main className="home">
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="hero-badge">
            ✨ Fine Dining • Memorable Experiences
          </span>

          <h1 id="hero-title" className="hero-title">
            Welcome to <span>Royal Restaurant</span>
          </h1>

          <p className="hero-subtitle">
            Fine dining, easy reservations, and a premium experience.
            Your perfect table is just a few clicks away.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-btn"
              onClick={goDashboard}
            >
              Book a Table <span aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className="hero-login-btn"
              onClick={goToFoodRecommendations}
            >
              🍴 Explore Food
            </button>

            {!isLoggedIn && (
              <button
                type="button"
                className="hero-login-btn"
                onClick={goToLogin}
              >
                Sign In
              </button>
            )}
          </div>

          <div className="hero-highlights">
            <span>✓ Easy Booking</span>
            <span>✓ Flexible Time Slots</span>
            <span>✓ Simple Management</span>
          </div>
        </div>

        <a className="scroll-indicator" href="#features">
          Explore Features <span aria-hidden="true">↓</span>
        </a>
      </section>

      {/* FEATURES SECTION */}
      <section
        className="features"
        id="features"
        aria-labelledby="features-title"
      >
        <div className="section-heading">
          <span className="section-eyebrow">WHY RESERVEDINE?</span>

          <h2 id="features-title">
            Everything You Need for Easy Reservations
          </h2>

          <p>
            A simple and convenient platform for booking tables and managing
            restaurant reservations.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon" aria-hidden="true">
                {feature.icon}
              </div>

              <span className="feature-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FOOD RECOMMENDATIONS CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <span className="section-eyebrow">DISCOVER OUR MENU</span>

          <h2>Find Your Perfect Dish</h2>

          <p>
            Explore food recommendations based on your food preference,
            budget, category, and spice level.
          </p>

          <button
            type="button"
            className="hero-btn cta-btn"
            onClick={goToFoodRecommendations}
          >
            Explore Food Recommendations →
          </button>
        </div>
      </section>

      {/* RESERVATION CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <span className="section-eyebrow">YOUR TABLE IS WAITING</span>

          <h2>Make Your Next Dining Experience Special</h2>

          <p>
            Get started today and manage your restaurant reservations
            in one convenient place.
          </p>

          <button
            type="button"
            className="hero-btn cta-btn"
            onClick={goDashboard}
          >
            {isLoggedIn ? "Go to Dashboard" : "Get Started"}{" "}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <span aria-hidden="true">🍽️</span>
          <strong>ReserveDine</strong>
        </div>

        <p>Making restaurant reservations simple and convenient.</p>

        <p className="footer-copyright">
          © {new Date().getFullYear()} ReserveDine. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
