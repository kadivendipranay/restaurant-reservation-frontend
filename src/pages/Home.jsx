import { useState } from "react";
import { CalendarDays, Utensils, RefreshCw, Sparkles, Armchair, ArrowRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/Home.css";

const POPULAR_DISHES = [
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
    name: "Classic Ribeye Steak",
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
];

const HIGHLIGHTS = [
  {
    icon: CalendarDays,
    title: "Real-Time Table Booking",
    description:
      "Select your party size, date, and evening time slot with live availability.",
  },
  {
    icon: RefreshCw,
    title: "Instant Rescheduling",
    description:
      "Modify your reservation time, guest count, or cancel directly from your dashboard.",
  },
  {
    icon: Sparkles,
    title: "AI Food Recommendations",
    description:
      "Filter dishes by dietary preference, spice level, and budget in ₹.",
  },
  {
    icon: Armchair,
    title: "Preferred Seating Zones",
    description:
      "Choose between Main Hall, Window, Patio, or VIP tables when booking.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { token, role } = useAuth();
  /** @type {[Record<string, boolean>, Function]} */
  const [likedDishes, setLikedDishes] = useState({});

  const resolvedToken = token || localStorage.getItem("token");
  const resolvedRole = (
    role ||
    localStorage.getItem("role") ||
    ""
  ).toUpperCase();
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

  const toggleLike = (dishName) => {
    setLikedDishes((prev) => ({ ...prev, [dishName]: !prev[dishName] }));
  };

  const handleCardKeyDown = (event, action) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  return (
    <main className="home">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="hero-badge">TABLE RESERVATION &amp; DINING</span>

          <h1 id="hero-title" className="hero-title">
            Welcome to
            <br />
            <span>ReserveDine</span>
          </h1>

          <p className="hero-subtitle">
            Check real-time table availability, reserve your preferred seating
            zone, and explore AI-curated menu recommendations.
          </p>

          <div className="hero-actions">
            <button type="button" className="hero-btn" onClick={goDashboard}>
              <CalendarDays size={18} aria-hidden="true" />
              {isLoggedIn
                ? isAdmin
                  ? "Admin Dashboard"
                  : "My Dashboard"
                : "Book a Table"}
              <ArrowRight size={17} aria-hidden="true" />
            </button>

            <button
              type="button"
              className="hero-login-btn"
              onClick={goToFoodRecommendations}
            >
              <Utensils size={18} aria-hidden="true" /> Explore Food
            </button>

            {!isLoggedIn && (
              <button
                type="button"
                className="hero-signin-btn"
                onClick={goToLogin}
              >
                Sign In
              </button>
            )}
          </div>

          <div className="hero-highlights">
            <span>✓ Live Slot Availability</span>
            <span>✓ Instant Rescheduling</span>
            <span>✓ AI Food Recommendations</span>
          </div>
        </div>

        <aside className="review-card" aria-labelledby="experience-title">
          <span className="experience-eyebrow"><Sparkles size={17} aria-hidden="true" /> DINING MADE SIMPLE</span>
          <h2 id="experience-title">A Smarter Dining Experience</h2>
          <ul className="experience-list">
            <li><CalendarDays aria-hidden="true" /> Real-time table availability</li>
            <li><Armchair aria-hidden="true" /> Preferred seating zones</li>
            <li><Sparkles aria-hidden="true" /> AI food recommendations</li>
            <li><RefreshCw aria-hidden="true" /> Easy reservation management</li>
          </ul>
        </aside>
      </section>

      {/* 2. POPULAR DISHES (4 FOOD CARDS BELOW HERO) */}
      <section className="menu-section" id="menu">
        <div className="menu-heading">
          <span className="menu-eyebrow">— POPULAR DISHES —</span>
          <h2>Featured Dishes</h2>
          <p>
            Explore sample dishes from our menu or open the AI Food
            Recommender to filter by budget and dietary preference.
          </p>
        </div>

        <div className="dish-grid four-col-grid">
          {POPULAR_DISHES.map((dish) => {
            const isLiked = Boolean(likedDishes[dish.name]);
            return (
              <article className="dish-card" key={dish.name}>
                <div className="dish-image-wrap">
                  <img
                    className="dish-image"
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                      event.currentTarget.parentElement?.classList.add("image-unavailable");
                    }}
                  />
                  <button
                    type="button"
                    className={`dish-like-btn ${isLiked ? "liked" : ""}`}
                    aria-label={`${isLiked ? "Unsave" : "Save"} ${dish.name}`}
                    aria-pressed={isLiked}
                    onClick={() => toggleLike(dish.name)}
                  >
                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} aria-hidden="true" />
                  </button>
                </div>

                <div className="dish-info">
                  <h3>{dish.name}</h3>
                  <span className="dish-category-label">{dish.category}</span>
                  <div className="dish-meta">
                    <strong className="dish-price">{dish.price}</strong>
                    <span className="dish-rating" title="Illustrative rating">
                      <span aria-hidden="true">★</span> {dish.rating}
                      <small> (sample)</small>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="menu-footer-action">
          <button
            type="button"
            className="view-menu-link"
            onClick={goToFoodRecommendations}
          >
            Open AI Food Recommendations →
          </button>
        </div>
      </section>

      {/* 3. RESTAURANT HIGHLIGHTS (ACTUAL SUPPORTED FEATURES) */}
      <section
        className="features"
        id="features"
        aria-labelledby="features-title"
      >
        <div className="section-heading">
          <span className="section-eyebrow">RESERVATION &amp; DINING FEATURES</span>
          <h2 id="features-title">What You Can Do on ReserveDine</h2>
          <p>
            Manage your table reservations, seating zones, and menu choices
            directly through our platform.
          </p>
        </div>

        <div className="highlights-grid">
          {HIGHLIGHTS.map((item, index) => (
            <article
              className="feature-card"
              key={item.title}
              role="button"
              tabIndex={0}
              onClick={item.icon === Sparkles ? goToFoodRecommendations : goDashboard}
              onKeyDown={(event) => handleCardKeyDown(event, item.icon === Sparkles ? goToFoodRecommendations : goDashboard)}
            >
              <div className="feature-icon" aria-hidden="true">
                <item.icon size={23} aria-hidden="true" />
              </div>
              <span className="feature-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. RESERVATION BANNER */}
      <section className="reservation-split-wrap">
        <div className="reservation-banner">
          <div className="banner-photo" aria-hidden="true" />
          <div className="banner-body">
            <div className="banner-copy">
              <span className="banner-eyebrow">TABLE RESERVATIONS</span>
              <h2>Reserve or Manage Your Table</h2>
              <p>
                Choose your date, time slot, party size, and seating zone in a
                few clicks.
              </p>
            </div>
            <button
              type="button"
              className="hero-btn banner-button"
              onClick={goDashboard}
            >
              <CalendarDays size={18} aria-hidden="true" /> {isLoggedIn ? "Go to Dashboard" : "Book a Table"} →
            </button>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <Utensils size={22} aria-hidden="true" />
          <strong>ReserveDine</strong>
        </div>
        <p>Table Reservation &amp; AI Food Recommendation System</p>
        <p className="footer-copyright">
          Created by <strong>Pranay Kumar</strong> · © {new Date().getFullYear()}{" "}
          ReserveDine. All rights reserved.
        </p>
      </footer>
    </main>
  );
}


