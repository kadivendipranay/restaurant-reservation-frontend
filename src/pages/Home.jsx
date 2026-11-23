// src/pages/Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/Home.css";

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Dining Concierge",
    desc: "Ask our assistant for dish pairings, vegetarian choices, or budget-friendly combos in ₹.",
  },
  {
    icon: "🗺️",
    title: "Preferred Seating Zones",
    desc: "Instant table matching across our Main Hall, Window, Patio, and VIP dining sections.",
  },
  {
    icon: "🥂",
    title: "Celebrations & Occasions",
    desc: "Personalize birthdays, anniversaries, and dietary or high-chair notes with every booking.",
  },
  {
    icon: "🔄",
    title: "Effortless Rescheduling",
    desc: "Plans changed? Update your reservation date, time slot, or party size in seconds.",
  },
  {
    icon: "👨‍🍳",
    title: "Chef's Seasonal Menu",
    desc: "Freshly prepared starters, wood-fired mains, artisanal desserts, and signature coolers.",
  },
  {
    icon: "⚡",
    title: "Live Table Availability",
    desc: "Check open evening dining slots in real time before confirming your visit.",
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
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85",
  },
];

const CATEGORIES = ["All", "Starters", "Main Course", "Desserts", "Beverages"];

const BENEFITS = [
  {
    icon: "▦",
    title: "Easy Reservations",
    description: "Book or reschedule your table in seconds.",
  },
  {
    icon: "◷",
    title: "Live Slot Availability",
    description: "Check open evening tables before you visit.",
  },
  {
    icon: "✦",
    title: "AI Menu & Dining Help",
    description: "Personalized dish & budget recommendations.",
  },
  {
    icon: "🥂",
    title: "Special Occasions",
    description: "Tailored seating for birthdays, dates & gatherings.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { token, role } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");

  const resolvedToken = token || localStorage.getItem("token");
  const resolvedRole = (role || localStorage.getItem("role") || "").toUpperCase();
  const isLoggedIn = Boolean(resolvedToken);
  const isAdmin = isLoggedIn && resolvedRole === "ADMIN";

  const goDashboard = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate(isAdmin ? "/admin" : "/user");
  };

  const goToLogin = () => navigate("/login");
  const goToFoodRecommendations = () => navigate("/food-recommendations");

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
            ✦ &nbsp; FINE DINING &amp; CURATED HOSPITALITY
          </span>

          <h1 id="hero-title" className="hero-title">
            Welcome to
            <br />
            <span>ReserveDine</span>
          </h1>

          <p className="hero-subtitle">
            Savor handcrafted cuisine, warm ambiance, and effortless table
            reservations tailored to your evening plans.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-btn"
              onClick={goDashboard}
            >
              {isLoggedIn
                ? isAdmin
                  ? "Open Admin Dashboard"
                  : "Go to Dashboard"
                : "Reserve a Table"}{" "}
              <span aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className="hero-login-btn"
              onClick={goToFoodRecommendations}
            >
              Explore Menu
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
            <span>◷ &nbsp; Dinner: 5:00 PM – 9:00 PM</span>
            <span>📍 &nbsp; Jubilee Hills, Hyderabad</span>
            <span>✦ &nbsp; AI Dining Concierge</span>
          </div>
        </div>

        <aside className="review-card" aria-label="Verified guest review">
          <div className="review-stars" aria-label="5 out of 5 stars">
            ★★★★★
          </div>
          <p className="review-quote">
            “The Grilled Salmon and warm candlelight ambiance made our
            anniversary dinner truly unforgettable.”
          </p>
          <div className="review-bottom">
            <span className="review-avatar">A</span>
            <span className="review-avatar">R</span>
            <span className="review-avatar">K</span>
            <span className="review-guests">
              <strong>Ananya R. · 4.9★ Rated</strong>
              <small>Verified Evening Guest</small>
            </span>
          </div>
        </aside>

        <a className="scroll-indicator" href="#benefits">
          Explore ReserveDine ↓
        </a>
      </section>

      {/* BENEFITS STRIP */}
      <section
        className="benefits-strip"
        id="benefits"
        aria-label="ReserveDine dining experience"
      >
        {BENEFITS.map((benefit) => (
          <article
            className="benefit-item"
            key={benefit.title}
            onClick={goDashboard}
          >
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
          <span className="menu-eyebrow">— &nbsp; CHEF&apos;S SELECTION &nbsp; —</span>
          <h2>Signature Dishes &amp; Flavors</h2>
          <p>
            Freshly prepared every evening with locally sourced ingredients and
            artisanal care.
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
            Ask AI for dish pairings →
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
                    <small> ({dish.reviews} reviews)</small>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="menu-disclaimer">
          All prices are in INR (₹) · Taxes extra as applicable · Freshly
          prepared to order.
        </p>
      </section>

      {/* SIX HOSPITALITY FEATURES */}
      <section
        className="features"
        id="features"
        aria-labelledby="features-title"
      >
        <div className="section-heading">
          <span className="section-eyebrow">THE RESERVEDINE EXPERIENCE</span>
          <h2 id="features-title">
            Thoughtful Hospitality at Every Step
          </h2>
          <p>
            From personalized AI menu guidance to seamless table reservations,
            every detail is designed around your comfort.
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
            ✦ &nbsp; PERSONALIZED TASTING GUIDE &nbsp; ✦
          </span>
          <h2>Not Sure What to Order?</h2>
          <p>
            Tell our AI Dining Concierge your budget, vegetarian or
            non-vegetarian preference, and spice level for instant dish
            recommendations.
          </p>
          <button
            type="button"
            className="hero-btn cta-btn"
            onClick={goToFoodRecommendations}
          >
            Get Personalized Recommendations →
          </button>
        </div>
      </section>

      {/* RESERVATION BANNER */}
      <section className="reservation-banner">
        <div className="banner-decoration" aria-hidden="true">
          ✦
        </div>
        <div className="banner-copy">
          <span className="banner-eyebrow">
            EVENING SERVICE · 5:00 PM – 9:00 PM DAILY
          </span>
          <h2>Reserve Your Table for Tonight</h2>
          <p>
            Road No. 36, Jubilee Hills, Hyderabad · Smart Casual Dining ·
            Complimentary Valet Parking Available.
          </p>
        </div>
        <button
          type="button"
          className="hero-btn banner-button"
          onClick={goDashboard}
        >
          {isLoggedIn ? "Go to Dashboard" : "Reserve a Table"} →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <span aria-hidden="true">🍽️</span>
          <strong>ReserveDine</strong>
        </div>
        <p>
          Road No. 36, Jubilee Hills, Hyderabad · Open Daily 5:00 PM – 9:00 PM
        </p>
        <p className="footer-copyright">
          Created by <strong>Pranay Kumar</strong> · © {new Date().getFullYear()} ReserveDine. All rights reserved.
        </p>
      </footer>
    </main>
  );
}