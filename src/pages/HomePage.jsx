
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/HomePage.css";

const FEATURES = [
  {
    icon: "🔐",
    title: "Secure Login",
    description: "Register and log in to access your personal dashboard.",
  },
  {
    icon: "📅",
    title: "Easy Reservations",
    description: "Choose your preferred date, time slot, and guest count.",
  },
  {
    icon: "🕒",
    title: "Flexible Time Slots",
    description: "Select from the available restaurant booking slots.",
  },
  {
    icon: "❌",
    title: "Cancel Bookings",
    description: "Manage your active reservations when plans change.",
  },
  {
    icon: "🛠️",
    title: "Admin Dashboard",
    description: "Manage bookings and review reservation information.",
  },
  {
    icon: "🔄",
    title: "Restore Bookings",
    description: "Restore eligible cancelled reservations as an admin.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

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

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <main className="home-container">
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-card" aria-labelledby="home-hero-title">
        <div className="hero-content">
          <span className="hero-badge">
            ✨ Your table, your time
          </span>

          <h1 className="hero-title" id="home-hero-title">
            Welcome to <span>ReserveDine</span>
          </h1>

          <p className="hero-subtitle">
            Great food starts with a great reservation. Book your table,
            choose your time, and make every dining experience special.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-btn"
              onClick={goDashboard}
            >
              Go to Dashboard <span aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={goToLogin}
            >
              Sign In
            </button>
          </div>

          <div className="hero-note">
            🍽️ Simple booking · ⏰ Convenient time slots · 📱 Easy management
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-plate">
            <span>🍽️</span>
          </div>

          <span className="floating-icon floating-icon-one">🥗</span>
          <span className="floating-icon floating-icon-two">✨</span>
          <span className="floating-icon floating-icon-three">🍴</span>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section" aria-labelledby="about-title">
        <div className="section-heading">
          <span className="section-eyebrow">ABOUT RESERVEDINE</span>
          <h2 id="about-title">Dining reservations made simple</h2>
          <p>
            ReserveDine brings booking and reservation management together
            in one convenient place.
          </p>
        </div>

        <div className="about-card">
          <div className="about-icon" aria-hidden="true">
            🍽️
          </div>

          <div className="about-content">
            <h3>Your dining experience, simplified</h3>

            <p>
              Whether you are a guest planning a meal or an administrator
              managing restaurant bookings, ReserveDine helps keep the
              reservation process organized. Create bookings, view their
              status, and manage eligible reservations from a simple dashboard.
            </p>

            <button
              type="button"
              className="about-link"
              onClick={goDashboard}
            >
              Get started <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section" aria-labelledby="features-title">
        <div className="section-heading">
          <span className="section-eyebrow">WHAT YOU CAN DO</span>
          <h2 id="features-title">Everything you need in one place</h2>
          <p>
            Explore the features designed to make reservation management easier.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon" aria-hidden="true">
                {feature.icon}
              </div>

              <span className="feature-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-card" aria-labelledby="cta-title">
        <div className="cta-content">
          <span className="cta-eyebrow">YOUR NEXT MEAL STARTS HERE</span>
          <h2 id="cta-title">Ready to make a reservation?</h2>
          <p>Sign in to manage your bookings and get started.</p>
        </div>

        <button
          type="button"
          className="cta-btn"
          onClick={goDashboard}
        >
          Book Your Table <span aria-hidden="true">→</span>
        </button>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-brand">
          <span className="footer-logo" aria-hidden="true">
            🍽️
          </span>
          <span>ReserveDine</span>
        </div>

        <p>Built with React, Node.js, Express, and MongoDB.</p>

        <p className="footer-copyright">
          © {new Date().getFullYear()} ReserveDine. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
