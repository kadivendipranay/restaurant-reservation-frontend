import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Utensils, Home, Sparkles, UtensilsCrossed, Info, ShieldCheck, LayoutDashboard, CalendarCheck2, LogOut, LogIn, UserPlus, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function safeGetStorage(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname, hash, key } = useLocation();
  const { token, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const isAuthenticated = Boolean(token || safeGetStorage("token"));
  const normalizedRole = (role || safeGetStorage("role") || "").toUpperCase();
  const isAdmin = normalizedRole === "ADMIN";
  const hasDashboard = isAuthenticated && (isAdmin || normalizedRole === "USER");

  useEffect(() => { setMenuOpen(false); }, [pathname, hash, key]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); toggleRef.current?.focus(); }
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const media = window.matchMedia("(min-width: 1201px)");
    const onResize = () => { if (media.matches) setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    media.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      media.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (pathname !== "/" || !hash) return;
    const ids = hash === "#about" ? ["about", "about-title", "benefits", "features"] : hash === "#features" ? ["features", "features-title"] : [];
    if (!ids.length) return;
    let observer: MutationObserver | undefined;
    const scroll = () => {
      const target = ids.map(id => document.getElementById(id)).find(Boolean);
      if (!target) return false;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      return true;
    };
    if (!scroll()) {
      observer = new MutationObserver(() => { if (scroll()) observer?.disconnect(); });
      observer.observe(document.body, { childList: true, subtree: true });
    }
    return () => observer?.disconnect();
  }, [pathname, hash, key]);

  const handleLogout = async () => {
    if (isLoggingOut || !window.confirm("Are you sure you want to logout?")) return;
    setIsLoggingOut(true);
    try {
      await logout();
      setMenuOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
      window.alert("Unable to log out. Please try again.");
    } finally { setIsLoggingOut(false); }
  };
  const closeMenu = () => setMenuOpen(false);
  const sectionClass = (section: string) => `nav-link-btn${pathname === "/" && hash === section ? " active-link" : ""}`;

  return (
    <header className="navbar" ref={headerRef}>
      <Link className="navbar-brand" to="/" onClick={closeMenu} aria-label="ReserveDine home">
        <span className="navbar-brand-icon"><Utensils size={19} aria-hidden="true" /></span>
        <span className="navbar-brand-text">ReserveDine</span>
      </Link>
      <button ref={toggleRef} type="button" className="navbar-toggle" aria-expanded={menuOpen} aria-controls={menuId} aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(open => !open)}>
        {menuOpen ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}
      </button>
      <div id={menuId} className={`navbar-panel${menuOpen ? " is-open" : ""}`}>
        <nav className="navbar-center-links" aria-label="Main navigation">
          <Link to="/" onClick={closeMenu} className={`nav-link-btn${pathname === "/" && !hash ? " active-link" : ""}`} aria-current={pathname === "/" && !hash ? "page" : undefined}><Home size={16} aria-hidden="true" />Home</Link>
          <Link to="/#features" onClick={closeMenu} className={sectionClass("#features")} aria-current={pathname === "/" && hash === "#features" ? "location" : undefined}><Sparkles size={16} aria-hidden="true" />Features</Link>
          <NavLink to="/food-recommendations" onClick={closeMenu} className={({ isActive }) => `nav-link-btn${isActive ? " active-link" : ""}`}><UtensilsCrossed size={16} aria-hidden="true" />Food Recommendations</NavLink>
          <Link to="/#about" onClick={closeMenu} className={sectionClass("#about")} aria-current={pathname === "/" && hash === "#about" ? "location" : undefined}><Info size={16} aria-hidden="true" />About</Link>
        </nav>
        <div className="navbar-right">
          {isAuthenticated && normalizedRole && <span className="navbar-role"><ShieldCheck size={15} aria-hidden="true" /><b>{normalizedRole}</b></span>}
          <div className="navbar-actions">
            {hasDashboard && <NavLink to={isAdmin ? "/admin" : "/user"} onClick={closeMenu} className="nav-dashboard-btn">{isAdmin ? <LayoutDashboard size={16} aria-hidden="true" /> : <CalendarCheck2 size={16} aria-hidden="true" />}{isAdmin ? "Admin Dashboard" : "User Dashboard"}</NavLink>}
            {!isAuthenticated ? <><Link className="nav-login-btn" to="/login" onClick={closeMenu}><LogIn size={16} aria-hidden="true" />Login</Link><Link className="nav-signup-btn" to="/register" onClick={closeMenu}><UserPlus size={16} aria-hidden="true" />Sign Up</Link></> : <button type="button" className="nav-logout-btn" disabled={isLoggingOut} onClick={handleLogout}><LogOut size={16} aria-hidden="true" />{isLoggingOut ? "Logging out…" : "Logout"}</button>}
          </div>
        </div>
      </div>
    </header>
  );
}
