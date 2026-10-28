import { useState } from "react";
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

const DISHES = [
  {
    name: "Garden Bruschetta",
    category: "Starters",
    price: "₹350",
    rating: "4.7",
    reviews: "84",
    image:
      "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Grilled Salmon",
    category: "Main Course",
    price: "₹750",
    rating: "4.8",
    reviews: "120",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Creamy Alfredo Pasta",
    category: "Main Course",
    price: "₹650",
    rating: "4.6",
    reviews: "98",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Classic Steak",
    category: "Main Course",
    price: "₹1,200",
    rating: "4.9",
    reviews: "86",
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Berry Cheesecake",
    category: "Desserts",
    price: "₹450",
    rating: "4.7",
    reviews: "104",
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Mint Cooler",
    category: "Beverages",
    price: "₹250",
    rating: "4.6",
    reviews: "92",
    
image: "https://img.magnific.com/premium-photo/fresh-fruit-cocktails-plastic-cups-with-straw_198067-947006.jpg",

  },
];

const CATEGORIES = [
  "All",
  "Starters",
  "Main Course",
  "Desserts",
  "Beverages",
];

const BENEFITS = [
  {
    icon: "▦",
    title: "Easy Reservations",
    description: "Book a table with a few simple steps.",
  },
  {
    icon: "◷",
    title: "Flexible Time Slots",
    description: "Choose from available dining times.",
  },
  {
    icon: "✦",
    title: "Premium Experience",
    description: "Discover dishes for your next outing.",
  },
  {
    icon: "✓",
    title: "Simple Management",
    description: "Manage reservations in one place.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase();
  const isLoggedIn = Boolean(token);

  const goDashboard = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    navigate(role === "ADMIN" ? "/admin" : "/user");
  };

  const goToLogin = () => navigate("/login");
  const goToFoodRecommendations = () =>
    navigate("/food-recommendations");

  const visibleDishes =
    activeCategory === "All"
      ? DISHES
      : DISHES.filter((dish) => dish.category === activeCategory);

  return (
    <main className="home">
      <Navbar />

      {/* HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="hero-badge">
            ✦ &nbsp; EXQUISITE DINING EXPERIENCE
          </span>

          <h1 id="hero-title" className="hero-title">
            Welcome to
            <br />
            <span>ReserveDine</span>
          </h1>

          <p className="hero-subtitle">
            Discover exceptional cuisine, seamless reservations,
            and unforgettable dining moments.
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
              Explore Food
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
            <span>✓ &nbsp; Easy Booking</span>
            <span>◷ &nbsp; Flexible Time Slots</span>
            <span>✦ &nbsp; Premium Experience</span>
          </div>
        </div>

        <aside className="review-card" aria-label="Sample guest review">
          <div className="review-stars" aria-label="5 stars">
            ★★★★★
          </div>
          <p className="review-quote">
            “A lovely place to plan your next dining experience.”
          </p>
          <div className="review-bottom">
            <span className="review-avatar">G</span>
            <span className="review-avatar">A</span>
            <span className="review-avatar">R</span>
            <span className="review-guests">
              <strong>Discover ReserveDine</strong>
              <small>Plan your next visit</small>
            </span>
          </div>
        </aside>

        <a className="scroll-indicator" href="#benefits">
          Discover ReserveDine ↓
        </a>
      </section>

      {/* BENEFITS STRIP */}
      <section
        className="benefits-strip"
        id="benefits"
        aria-label="ReserveDine benefits"
      >
        {BENEFITS.map((benefit) => (
          <article className="benefit-item" key={benefit.title}>
            <div className="benefit-icon" aria-hidden="true">
              {benefit.icon}
            </div>
            <div>
              <h2>{benefit.title}</h2>
              <p>{benefit.description}</p>
            </div>
          </article>
        ))}
      </section>

      {/* MENU SHOWCASE */}
      <section className="menu-section" id="menu">
        <div className="menu-heading">
          <span className="menu-eyebrow">— &nbsp; OUR MENU &nbsp; —</span>
          <h2>Find Your Perfect Dish</h2>
          <p>
            Explore delicious inspiration for your next dining experience.
          </p>
        </div>

        <div className="menu-toolbar">
          <div
            className="category-tabs"
            aria-label="Filter dishes by category"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-tab ${
                  activeCategory === category ? "active" : ""
                }`}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="view-menu-link"
            onClick={goToFoodRecommendations}
          >
            Explore recommendations →
          </button>
        </div>

        <div className="dish-grid">
          {visibleDishes.map((dish) => (
            <article className="dish-card" key={dish.name}>
              <div className="dish-image-wrap">
                <img
                  className="dish-image"
                  src={dish.image}
                  alt={dish.name}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />
                <span className="dish-category">{dish.category}</span>
              </div>

              <div className="dish-info">
                <h3>{dish.name}</h3>
                <div className="dish-meta">
                  <strong className="dish-price">{dish.price}</strong>
                  <span className="dish-rating">
                    <span aria-hidden="true">★</span> {dish.rating}
                    <small> ({dish.reviews})</small>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="menu-disclaimer">
          Sample menu content for design demonstration. Prices and ratings are
          illustrative and are not live restaurant data.
        </p>
      </section>

      {/* ALL SIX PROJECT FEATURES */}
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
            From convenient table bookings to reservation administration,
            explore the features built into ReserveDine.
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

      {/* FOOD RECOMMENDATION CTA */}
      <section className="cta-section">
        <div className="cta-content">
         <span className="section-eyebrow">
  ✦ &nbsp; DISCOVER OUR MENU &nbsp; ✦
</span>
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
      <section className="reservation-banner">
        <div className="banner-decoration" aria-hidden="true">
          ✦
        </div>
        <div className="banner-copy">
          <span className="banner-eyebrow">YOUR TABLE IS WAITING</span>
          <h2>Make Your Next Dining Experience Special</h2>
          <p>
            Choose your date, time, and party size. Manage your reservations
            in one convenient place.
          </p>
        </div>
        <button
          type="button"
          className="hero-btn banner-button"
          onClick={goDashboard}
        >
          {isLoggedIn ? "Go to Dashboard" : "Book a Table Now"} →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <span aria-hidden="true">🍽️</span>
          <strong>ReserveDine</strong>
        </div>
        <p>Thoughtful reservations. Memorable dining.</p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} ReserveDine. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
