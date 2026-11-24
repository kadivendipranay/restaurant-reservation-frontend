import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/HomePage.css";

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Dining & Booking Assistant",
    description:
      "Ask about veg/non-veg dishes, budget combos in ₹, or book a table naturally in chat.",
    target: "ai",
  },
  {
    icon: "📅",
    title: "Live Slot & Table Matching",
    description:
      "See real-time open table counts per time slot and get best-fit seating automatically.",
    target: "dashboard",
  },
  {
    icon: "✨",
    title: "Occasions & Special Requests",
    description:
      "Personalize birthdays, anniversaries, or dietary and seating notes with every booking.",
    target: "dashboard",
  },
  {
    icon: "🔄",
    title: "Instant Rescheduling",
    description:
      "Modify your active reservation's date, time, or party size in one click without cancelling.",
    target: "dashboard",
  },
  {
    icon: "🗺️",
    title: "Live Floor & Table Grid",
    description:
      "Admins can monitor real-time table occupancy by zone and manage seating capacity live.",
    target: "dashboard",
  },
  {
    icon: "📊",
    title: "Analytics & Shift Export",
    description:
      "Track peak dining hours, status trends with interactive charts, and export CSV shift sheets.",
    target: "dashboard",
  },
];

function safeGetStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export default function HomePage() {
  const navigate = useNavigate();
  const { token, role } = useAuth();

  const isAuthenticated = Boolean(token || safeGetStorage("token"));
  const resolvedRole = (
    role ||
    safeGetStorage("role") ||
    ""
  ).toUpperCase();
  const isAdmin = isAuthenticated && resolvedRole === "ADMIN";

  const goDashboard = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(isAdmin ? "/admin" : "/user");
  };

  const goToAiMenu = () => {
    navigate("/food-recommendations");
  };

  const handleFeatureClick = (target) => {
    if (target === "ai") {
      goToAiMenu();
      return;
    }
    goDashboard();
  };

  const handleFeatureKeyDown = (event, target) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleFeatureClick(target);
    }
  };

  return (
    <main className="home-container">
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-card" aria-labelledby="home-hero-title">
        <div className="hero-content">
          <span className="hero-badge">
            ✨ AI-Powered Dining &amp; Table Reservations
          </span>

          <h1 className="hero-title" id="home-hero-title">
            Welcome to <span>ReserveDine</span>
          </h1>

          <p className="hero-subtitle">
            Great food starts with a great reservation. Check live table
            availability, chat with our AI dining assistant, and customize every
            visit effortlessly.
          </p>

          <div className="hero-actions">
            <button type="button" className="hero-btn" onClick={goDashboard}>
              {isAuthenticated
                ? isAdmin
                  ? "Open Admin Command Centre"
                  : "Go to My Dashboard"
                : "Book a Table Now"}{" "}
              <span aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={isAuthenticated ? goToAiMenu : () => navigate("/login")}
            >
              {isAuthenticated ? "Explore AI Menu" : "Sign In"}
            </button>
          </div>

          <div className="hero-note">
            🤖 AI Menu &amp; Booking Help · ⏰ 5 PM – 9 PM Slots · 🔄 Instant
            Rescheduling
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
            ReserveDine brings live table availability, AI assistance, and floor
            operations together in one seamless platform.
          </p>
        </div>

        <div className="about-card">
          <div className="about-icon" aria-hidden="true">
            🍽️
          </div>

          <div className="about-content">
            <h3>Your dining experience, simplified</h3>

            <p>
              Whether you are a guest planning a celebration or an administrator
              overseeing live floor occupancy, ReserveDine keeps every table and
              time slot organized—from instant best-fit table matching to
              real-time shift insights.
            </p>

            <button type="button" className="about-link" onClick={goDashboard}>
              {isAuthenticated ? "Continue to Dashboard" : "Get started"}{" "}
              <span aria-hidden="true">→</span>
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
            Explore the smart features built for guests and restaurant teams
            alike.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feature, index) => (
            <article
              className="feature-card"
              key={feature.title}
              role="button"
              tabIndex={0}
              onClick={() => handleFeatureClick(feature.target)}
              onKeyDown={(event) => handleFeatureKeyDown(event, feature.target)}
            >
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
          <p>
            {isAuthenticated
              ? "Jump back into your dashboard to book, reschedule, or manage tables."
              : "Sign in to check live table availability and reserve your spot."}
          </p>
        </div>

        <button type="button" className="cta-btn" onClick={goDashboard}>
          {isAuthenticated ? "Open Dashboard" : "Book Your Table"}{" "}
          <span aria-hidden="true">→</span>
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

        <p>Built with React, Node.js, Express, MongoDB, and OpenAI.</p>

        <p className="footer-copyright">
          © {new Date().getFullYear()} ReserveDine. All rights reserved.
        </p>
      </footer>
    </main>
  );
}