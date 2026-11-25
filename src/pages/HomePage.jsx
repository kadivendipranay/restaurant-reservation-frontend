import { useNavigate } from "react-router-dom";
import { ArrowRight, Bot, CalendarDays, Sparkles, RefreshCw, LayoutGrid, ChartNoAxesCombined, Utensils, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/HomePage.css";

const FEATURES = [
  { icon: Bot, title: "AI Dining & Booking Assistant", description: "Ask about veg/non-veg dishes, budget combos in ₹, or book a table naturally in chat.", target: "ai" },
  { icon: CalendarDays, title: "Live Slot & Table Matching", description: "See real-time open table counts per time slot and get best-fit seating automatically.", target: "dashboard" },
  { icon: Sparkles, title: "Occasions & Special Requests", description: "Personalize birthdays, anniversaries, or dietary and seating notes with every booking.", target: "dashboard" },
  { icon: RefreshCw, title: "Instant Rescheduling", description: "Modify your active reservation's date, time, or party size without cancelling.", target: "dashboard" },
  { icon: LayoutGrid, title: "Live Floor & Table Grid", description: "Admins can monitor real-time table occupancy by zone and manage seating capacity.", target: "admin" },
  { icon: ChartNoAxesCombined, title: "Analytics & Shift Export", description: "Track peak dining hours, status trends with interactive charts, and export CSV shift sheets.", target: "admin" },
];

function safeGetStorage(key) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

export default function HomePage() {
  const navigate = useNavigate();
  const { token, role } = useAuth();
  const isAuthenticated = Boolean(token || safeGetStorage("token"));
  const isAdmin = isAuthenticated && String(role || safeGetStorage("role") || "").toUpperCase() === "ADMIN";
  const goDashboard = () => navigate(!isAuthenticated ? "/login" : isAdmin ? "/admin" : "/user");
  const goToAiMenu = () => navigate("/food-recommendations");
  const dashboardLabel = isAuthenticated ? (isAdmin ? "Open Admin Dashboard" : "My Dashboard") : "Book a Table";

  return (
    <div className="home-container">
      <Navbar />
      <main>
        <section className="hero-card" aria-labelledby="home-hero-title">
          <div className="hero-content">
            <span className="hero-badge"><Sparkles size={16} aria-hidden="true" /> AI-POWERED DINING &amp; RESERVATIONS</span>
            <h1 className="hero-title" id="home-hero-title">Welcome to <span>ReserveDine</span></h1>
            <p className="hero-subtitle">Great food starts with a great reservation. Check live table availability, chat with our AI dining assistant, and customize every visit effortlessly.</p>
            <div className="hero-actions">
              <button type="button" className="hero-btn" onClick={goDashboard}><CalendarDays size={18} aria-hidden="true" />{dashboardLabel}<ArrowRight size={18} aria-hidden="true" /></button>
              <button type="button" className="hero-secondary-btn" onClick={goToAiMenu}><Utensils size={18} aria-hidden="true" /> Explore AI Menu</button>
            </div>
            <div className="hero-note"><span>5 PM – 9 PM Slots</span><span>Instant Rescheduling</span></div>
          </div>
          <aside className="hero-visual" aria-label="Dining features">
            <span className="visual-eyebrow"><Sparkles size={16} aria-hidden="true" /> DINING MADE SIMPLE</span>
            <h2>A smarter dining experience</h2>
            <ul>{["Live table availability", "Personalized dining requests", "AI food recommendations", "Easy reservation management"].map(text => <li key={text}><CheckCircle2 size={19} aria-hidden="true" />{text}</li>)}</ul>
          </aside>
        </section>
        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="section-heading"><span className="section-eyebrow">ABOUT RESERVEDINE</span><h2 id="about-title">Dining reservations made simple</h2><p>ReserveDine brings live table availability, AI assistance, and floor operations together in one seamless platform.</p></div>
          <div className="about-card"><div className="about-icon"><Utensils size={28} aria-hidden="true" /></div><div className="about-content"><h3>Your dining experience, simplified</h3><p>Whether you are a guest planning a celebration or an administrator overseeing live floor occupancy, ReserveDine keeps every table and time slot organized—from best-fit table matching to real-time shift insights.</p><button type="button" className="about-link" onClick={goDashboard}>{isAuthenticated ? "Continue to Dashboard" : "Get started"}<ArrowRight size={16} aria-hidden="true" /></button></div></div>
        </section>
        <section className="features-section" id="features" aria-labelledby="features-title">
          <div className="section-heading"><span className="section-eyebrow">WHAT YOU CAN DO</span><h2 id="features-title">Everything you need in one place</h2><p>Explore the smart features built for guests and restaurant teams alike.</p></div>
          <div className="features-grid">
            {FEATURES.map(({ icon: Icon, title, description, target }, index) => (
              <article className="feature-card" key={title}>
                <div className="feature-icon"><Icon size={23} aria-hidden="true" /></div><span className="feature-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {target === "admin" && <span className="admin-label">ADMIN FEATURE</span>}
                <h3>{title}</h3><p>{description}</p>
                {target !== "admin" || isAdmin ? <button type="button" className="about-link feature-link" onClick={target === "ai" ? goToAiMenu : goDashboard} aria-label={`Explore ${title}`}>Explore feature <ArrowRight size={15} aria-hidden="true" /></button> : <span className="admin-note">Available to administrators</span>}
              </article>
            ))}
          </div>
        </section>
        <section className="cta-card" aria-labelledby="cta-title"><div className="cta-content"><span className="cta-eyebrow">YOUR NEXT MEAL STARTS HERE</span><h2 id="cta-title">Ready to make a reservation?</h2><p>{isAuthenticated ? "Jump back into your dashboard to book, reschedule, or manage tables." : "Sign in to check live table availability and reserve your spot."}</p></div><button type="button" className="cta-btn" onClick={goDashboard}>{isAuthenticated ? "Open Dashboard" : "Book Your Table"}<ArrowRight size={18} aria-hidden="true" /></button></section>
      </main>
      <footer className="home-footer"><div className="footer-brand"><Utensils size={22} aria-hidden="true" /><span>ReserveDine</span></div><p>Built with React, Node.js, Express, MongoDB, and OpenAI.</p><p className="footer-copyright">© {new Date().getFullYear()} ReserveDine. All rights reserved.</p></footer>
    </div>
  );
}
