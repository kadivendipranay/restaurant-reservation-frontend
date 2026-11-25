import { useState } from 'react';
import { CalendarDays, Utensils, ArrowRight, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const photo = (id, width = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=85`;
const DISHES = [
  { id: 'salmon', name: 'Grilled Salmon', category: 'Main course', price: 750, description: 'Grilled salmon with a bright, fresh vegetable garnish.', image: photo('1467003909585-2f8a72700288') },
  { id: 'pasta', name: 'Herb Pesto Pasta', category: 'Main course', price: 650, description: 'Pasta tossed with herbs and colorful vegetables.', image: photo('1473093295043-cdd812d0e601') },
  { id: 'steak', name: 'Classic Ribeye Steak', category: 'Main course', price: 1200, description: 'Grilled steak served with vegetables.', image: photo('1544025162-d76694265947') },
  { id: 'cheesecake', name: 'Berry Cheesecake', category: 'Dessert', price: 450, description: 'Creamy cheesecake finished with a berry topping.', image: photo('1533134242443-d4fd215305ad') },
];
const BENEFITS = [
  { title: 'A table when you need it', description: 'Check available dates and evening time slots.', target: 'booking', label: 'Reserve your table', image: photo('1517248135467-4c7edcad34c4'), alt: 'Warmly lit restaurant dining tables' },
  { title: 'Your favorite spot', description: 'Explore Main Hall, Window, Patio and VIP seating options.', target: 'booking', label: 'Explore seating', image: photo('1552566626-52f8b828add9'), alt: 'Restaurant interior and seating' },
  { title: 'Find your next favorite', description: 'Discover dishes by taste, dietary preference and budget.', target: 'food', label: 'Discover dishes', image: photo('1546069901-ba9599a7e63c'), alt: 'Colorful freshly prepared food' },
  { title: 'Dining on your terms', description: 'Manage or reschedule your reservation from your dashboard.', target: 'booking', label: 'Manage reservations', image: photo('1514933651103-005eec06c04b'), alt: 'Inviting restaurant dining atmosphere' },
];
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const FAVORITES_KEY = 'reservedine.home.favorites.v1';
function readStorage(key) { try { return localStorage.getItem(key); } catch { return null; } }
function readFavorites() { try { const value = JSON.parse(readStorage(FAVORITES_KEY) || '[]'); return Array.isArray(value) ? value.filter(id => typeof id === 'string') : []; } catch { return []; } }

export default function Home() {
  const navigate = useNavigate();
  const { token, role } = useAuth();
  const [favorites, setFavorites] = useState(readFavorites);
  const loggedIn = Boolean(token || readStorage('token'));
  const admin = loggedIn && (role || readStorage('role') || '').toUpperCase() === 'ADMIN';
  const dashboard = loggedIn ? (admin ? '/admin' : '/user') : '/login';
  const bookingLabel = loggedIn ? (admin ? 'Admin Dashboard' : 'My Dashboard') : 'Book a Table';
  const goDashboard = () => navigate(dashboard);
  const goFood = () => navigate('/food-recommendations');
  function toggleFavorite(id) {
    const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    setFavorites(next);
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); } catch { /* Favorites remain available for this visit. */ }
  }
  return (
    <div className="home rd-restaurant">
      <Navbar />
      <main>
        <section className="rd-hero" aria-labelledby="hero-title">
          <div className="rd-hero-copy">
            <span className="rd-eyebrow">RESERVEDINE · TABLE RESERVATIONS</span>
            <h1 id="hero-title">Your table.<br/><em>Your occasion.</em></h1>
            <p>From a quiet dinner to a special celebration, discover something delicious and find the perfect place to gather.</p>
            <div className="rd-actions">
              <button className="rd-button rd-primary" onClick={goDashboard}><CalendarDays size={19} aria-hidden="true"/>{bookingLabel}<ArrowRight size={18} aria-hidden="true"/></button>
              <a className="rd-button rd-outline" href="#menu" onClick={event => { event.preventDefault(); document.getElementById('menu')?.scrollIntoView({block:'start'}); }}><Utensils size={18} aria-hidden="true"/>Explore the Menu</a>
            </div>
          </div>
        </section>
        <section className="rd-section rd-menu" id="menu" aria-labelledby="menu-title">
          <div className="rd-heading"><span className="rd-eyebrow">A TASTE OF RESERVEDINE</span><h2 id="menu-title">Signature dishes</h2><p>Discover inviting flavors, from satisfying mains to a sweet finish.</p></div>
          <div className="rd-dishes">
            {DISHES.map(dish => <article className="rd-dish" key={dish.id}>
              <div className="rd-dish-photo"><img src={dish.image} alt={dish.name} loading="lazy" decoding="async" width="800" height="600" onError={event => { event.currentTarget.hidden = true; }}/><button type="button" className={`rd-favorite ${favorites.includes(dish.id) ? 'is-saved' : ''}`} aria-label={`${favorites.includes(dish.id) ? 'Unsave' : 'Save'} ${dish.name}`} aria-pressed={favorites.includes(dish.id)} onClick={() => toggleFavorite(dish.id)}><Heart size={20} fill={favorites.includes(dish.id) ? 'currentColor' : 'none'} aria-hidden="true"/></button></div>
              <div className="rd-dish-copy"><span className="rd-category">{dish.category}</span><h3>{dish.name}</h3><p>{dish.description}</p><strong>{currency.format(dish.price)}</strong></div>
            </article>)}
          </div>
          <p className="rd-note">Illustrative menu and prices for this demo. Food photography is representative.</p>
          <div className="rd-center"><button className="rd-button rd-secondary" onClick={goFood}>Explore food recommendations <ArrowRight size={18} aria-hidden="true"/></button></div>
        </section>
        <section className="rd-experience" id="benefits" aria-labelledby="experience-title">
          <div className="rd-experience-photo" aria-hidden="true"/>
          <div className="rd-experience-copy"><span className="rd-eyebrow">MAKE IT YOUR OCCASION</span><h2 id="experience-title">Good food.<br/>Better together.</h2><p>Whether you're planning a dinner for two or a gathering with friends, choose a seating preference and make the occasion your own.</p><button className="rd-button rd-primary" onClick={goDashboard}>{bookingLabel}<ArrowRight size={18} aria-hidden="true"/></button></div>
        </section>
        <section className="rd-section rd-benefits" id="features" aria-labelledby="features-title">
          <div className="rd-heading"><span className="rd-eyebrow">THE RESERVEDINE EXPERIENCE</span><h2 id="features-title">Enjoy the moment</h2><p>We make planning your next meal easier.</p></div>
          <div className="rd-benefit-grid">
            {BENEFITS.map(({ title, description, target, label, image, alt }) => (
              <article className="rd-benefit-card" key={title}>
                <div className="rd-benefit-photo">
                  <img src={image} alt={alt} loading="lazy" decoding="async" width="800" height="600" onError={event => { event.currentTarget.hidden = true; }} />
                </div>
                <div className="rd-benefit-copy">
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <button type="button" className="rd-text-link" onClick={target === 'food' ? goFood : goDashboard}>{label}<ArrowRight size={15} aria-hidden="true" /></button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="rd-final" aria-labelledby="reserve-title"><span className="rd-eyebrow">YOUR NEXT DINING EXPERIENCE</span><h2 id="reserve-title">There's a place for you.</h2><p>Choose your date, time and party size to get started.</p><button className="rd-button rd-primary" onClick={goDashboard}><CalendarDays size={18} aria-hidden="true"/>{bookingLabel}<ArrowRight size={18} aria-hidden="true"/></button></section>
      </main>
      <footer className="rd-footer">
        <div className="rd-footer-main">
          <div>
            <Link to="/" className="rd-brand">
              <Utensils size={23} aria-hidden="true" /> ReserveDine
            </Link>
            <p>Thoughtful dining. Effortless reservations.</p>
          </div>
          <nav aria-label="Footer navigation">
            <button type="button" onClick={goDashboard}>Reservations</button>
            <button type="button" onClick={goFood}>Food recommendations</button>
            <button type="button" onClick={() => document.getElementById('benefits')?.scrollIntoView()}>Dining experience</button>
          </nav>
        </div>
        <div className="rd-footer-bottom">
          <span>© {new Date().getFullYear()} ReserveDine. All rights reserved.</span>
          <span>Restaurant reservation demo</span>
        </div>
        <p className="footer-developer">
          Designed &amp; Developed by{' '}
          <a href="https://www.linkedin.com/in/pranay-kumar-kadivendi-662a82169"
             target="_blank" rel="noopener noreferrer">
            Kadivendi Pranay Kumar
          </a>
        </p>
      </footer>
    </div>
  );
}
