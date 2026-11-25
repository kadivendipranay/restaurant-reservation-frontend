import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CalendarDays, Utensils, Clock, LayoutGrid, ChartNoAxesCombined } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/HomePage.css";

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=85`;
const GUEST_FEATURES = [
  { title: "Discover your next favorite", description: "Explore vegetarian and non-vegetarian dishes, budget combinations and AI-assisted dining recommendations.", label: "Explore the menu", target: "food", image: photo("1546069901-ba9599a7e63c"), alt: "Freshly prepared colorful meal" },
  { title: "A table for every occasion", description: "Check live time-slot availability and let us match your party size to a suitable table.", label: "Find a table", image: photo("1517248135467-4c7edcad34c4"), alt: "Warmly lit restaurant tables" },
  { title: "Make it memorable", description: "Add birthday, anniversary, dietary or seating requests to your reservation.", label: "Plan your visit", image: photo("1514933651103-005eec06c04b"), alt: "Intimate restaurant interior" },
  { title: "When plans change", description: "Update the date, time or party size of an active reservation without cancelling it.", label: "Manage reservations", image: photo("1552566626-52f8b828add9"), alt: "Inviting restaurant seating" },
];
const ADMIN_FEATURES = [
  { icon: LayoutGrid, title: "Live floor & table grid", description: "Monitor table occupancy by zone and manage seating capacity." },
  { icon: ChartNoAxesCombined, title: "Analytics & shift export", description: "Review peak dining hours, reservation trends and export CSV shift sheets." },
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
  const goFood = () => navigate("/food-recommendations");
  const dashboardLabel = isAuthenticated ? (isAdmin ? "Admin Dashboard" : "My Dashboard") : "Book a Table";
  return (
    <div className="home-container hp-restaurant">
      <Navbar />
      <main>
        <section className="hp-hero" aria-labelledby="hp-title">
          <div className="hp-hero-copy">
            <span className="hp-eyebrow">THE RESERVEDINE EXPERIENCE</span>
            <h1 id="hp-title">Good food.<br/><em>Great company.</em></h1>
            <p>From an intimate dinner to a special celebration, find a table and discover something delicious.</p>
            <div className="hp-actions">
              <button type="button" className="hp-button hp-primary" onClick={goDashboard}><CalendarDays size={19} aria-hidden="true"/>{dashboardLabel}<ArrowRight size={18} aria-hidden="true"/></button>
              <button type="button" className="hp-button hp-outline" onClick={goFood}><Utensils size={18} aria-hidden="true"/>Explore Food</button>
            </div>
            <p className="hp-hours"><Clock size={16} aria-hidden="true"/> Evening reservation slots · 5 PM – 9 PM</p>
          </div>
        </section>
        <section className="hp-about" id="about" aria-labelledby="hp-about-title">
          <div className="hp-about-photo"><img src={photo("1552566626-52f8b828add9")} alt="Restaurant dining room" width="900" height="600" loading="lazy" decoding="async"/></div>
          <div className="hp-about-copy"><span className="hp-eyebrow">MAKE IT YOUR OCCASION</span><h2 id="hp-about-title">A place to gather.</h2><p>Choose your preferred seating, add special requests and plan a meal around the people who matter. Our AI dining assistant can help with food choices and booking questions.</p><button type="button" className="hp-link" onClick={goDashboard}>Plan your visit <ArrowRight size={17} aria-hidden="true"/></button></div>
        </section>
        <section className="hp-section" id="features" aria-labelledby="hp-features-title">
          <div className="hp-heading"><span className="hp-eyebrow">DINING MADE SIMPLE</span><h2 id="hp-features-title">Enjoy every moment</h2><p>Thoughtful options for your next visit, from the first reservation to the final course.</p></div>
          <div className="hp-grid">
            {GUEST_FEATURES.map(({title, description, label, target, image, alt}) => <article className="hp-card" key={title}>
              <div className="hp-card-photo"><img src={image} alt={alt} width="900" height="600" loading="lazy" decoding="async"/></div>
              <div className="hp-card-copy"><h3>{title}</h3><p>{description}</p><button type="button" className="hp-link" onClick={target === "food" ? goFood : goDashboard}>{label}<ArrowRight size={16} aria-hidden="true"/></button></div>
            </article>)}
          </div>
        </section>
        <section className="hp-section hp-management" aria-labelledby="hp-admin-title">
          <div className="hp-heading"><span className="hp-eyebrow">FOR RESTAURANT TEAMS</span><h2 id="hp-admin-title">Behind the dining experience</h2></div>
          <div className="hp-admin-grid">{ADMIN_FEATURES.map(({icon: Icon, title, description}) => <article className="hp-admin-card" key={title}><Icon size={26} aria-hidden="true"/><h3>{title}</h3><p>{description}</p>{isAdmin ? <button type="button" className="hp-link" onClick={goDashboard}>Open dashboard <ArrowRight size={16} aria-hidden="true"/></button> : <small>Available to administrators</small>}</article>)}</div>
        </section>
        <section className="hp-final" aria-labelledby="hp-reserve-title"><span className="hp-eyebrow">YOUR NEXT DINING EXPERIENCE</span><h2 id="hp-reserve-title">There's a place for you.</h2><p>Choose your date, time and party size to get started.</p><button type="button" className="hp-button hp-primary" onClick={goDashboard}>{dashboardLabel}<ArrowRight size={18} aria-hidden="true"/></button></section>
      </main>
      <footer className="hp-footer"><div className="hp-footer-main"><div><Link className="hp-brand" to="/"><Utensils size={23} aria-hidden="true"/>ReserveDine</Link><p>Thoughtful dining. Effortless reservations.</p></div><nav aria-label="Footer navigation"><button type="button" onClick={goDashboard}>Reservations</button><button type="button" onClick={goFood}>Food recommendations</button><button type="button" onClick={() => document.getElementById("about")?.scrollIntoView({block:"start"})}>Dining experience</button></nav></div><div className="hp-footer-bottom"><span>© {new Date().getFullYear()} ReserveDine · Restaurant reservation demo</span><span>Designed &amp; Developed by <a href="https://www.linkedin.com/in/pranay-kumar-kadivendi-662a82169" target="_blank" rel="noopener noreferrer">Kadivendi Pranay Kumar</a></span></div></footer>
    </div>
  );
}
