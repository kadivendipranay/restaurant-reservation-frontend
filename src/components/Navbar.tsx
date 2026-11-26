
import { useEffect, useId, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Utensils,
  CalendarDays,
  ChevronDown,
  UserRound,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname, hash, key } = useLocation();

  const { token, role, logout } = useAuth();

  // Global shopping cart
  const { cartCount } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const accountToggle = useRef<HTMLButtonElement>(null);

  const menuId = useId();
  const accountId = useId();
  const isAuthenticated = Boolean(token);
  const normalizedRole = (role || "").toUpperCase();
  const isAdmin = normalizedRole === "ADMIN";
  const hasDashboard =
    isAuthenticated &&
    (isAdmin || normalizedRole === "USER");

  const dashboard = isAdmin ? "/admin" : "/user";

  const closeMenus = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname, hash, key]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (accountOpen) {
        setAccountOpen(false);
        accountToggle.current?.focus();
      } else if (menuOpen) {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;

      if (!headerRef.current?.contains(target)) {
        setMenuOpen(false);
      }

      if (!accountRef.current?.contains(target)) {
        setAccountOpen(false);
      }
    };

    const media = window.matchMedia(
      "(min-width: 1401px)"
    );

    const onResize = () => {
      setMenuOpen(false);
      setAccountOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    media.addEventListener("change", onResize);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener(
        "pointerdown",
        onPointer
      );
      media.removeEventListener("change", onResize);
    };
  }, [menuOpen, accountOpen]);

  useEffect(() => {
    if (pathname !== "/" || !hash) return;

    const ids =
      hash === "#about"
        ? ["about", "about-title", "benefits", "features"]
        : hash === "#features"
        ? ["features", "features-title"]
        : [];

    if (!ids.length) return;

    let observer: MutationObserver | undefined;

    const scroll = () => {
      const target = ids
        .map((id) => document.getElementById(id))
        .find(Boolean);

      if (!target) return false;

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start",
      });

      return true;
    };

    if (!scroll()) {
      observer = new MutationObserver(() => {
        if (scroll()) observer?.disconnect();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer?.disconnect();
  }, [pathname, hash, key]);

  const handleLogout = async () => {
    if (
      isLoggingOut ||
      !window.confirm("Are you sure you want to logout?")
    ) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
      closeMenus();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
      window.alert(
        "Unable to log out. Please try again."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sectionClass = (section: string) =>
    `rdn-link${
      pathname === "/" && hash === section
        ? " active-link"
        : ""
    }`;

  return (
    <header
      className="navbar rdn-navbar"
      ref={headerRef}
    >
      {/* RESTAURANT BRAND */}
      <Link
        className="rdn-brand"
        to="/"
        onClick={closeMenus}
        aria-label="ReserveDine home"
      >
        <span className="rdn-brand-icon">
          <Utensils size={28} aria-hidden="true" />
        </span>

        <span className="rdn-brand-copy">
          <span className="rdn-brand-name">
            Reserve
            <span className="rdn-brand-accent">
              Dine
            </span>
          </span>

          <span className="rdn-tagline">
            DINE · DISCOVER · RESERVE
          </span>
        </span>
      </Link>

      {/* NAVIGATION PANEL */}
      <div
        id={menuId}
        className={`rdn-panel${
          menuOpen ? " is-open" : ""
        }`}
      >
        <nav
          className="rdn-links"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            onClick={closeMenus}
            className={sectionClass("")}
            aria-current={
              pathname === "/" && !hash
                ? "page"
                : undefined
            }
          >
            Home
          </Link>

          <Link
            to="/#features"
            onClick={closeMenus}
            className={sectionClass("#features")}
            aria-current={
              pathname === "/" && hash === "#features"
                ? "location"
                : undefined
            }
          >
            Experience
          </Link>

          <NavLink
            to="/food-recommendations"
            onClick={closeMenus}
            className={({ isActive }) =>
              `rdn-link${
                isActive ? " active-link" : ""
              }`
            }
          >
            Explore Food
          </NavLink>

          <Link
            to="/#about"
            onClick={closeMenus}
            className={sectionClass("#about")}
            aria-current={
              pathname === "/" && hash === "#about"
                ? "location"
                : undefined
            }
          >
            About Us
          </Link>
        </nav>

        {/* AUTHENTICATION ACTIONS */}
        <div className="rdn-actions">
          {!isAuthenticated ? (
            <>
              <Link
                className="rdn-signin"
                to="/login"
                onClick={closeMenus}
              >
                Sign In
              </Link>

              <Link
  className="rdn-register"
  to="/login?tab=register"
  onClick={closeMenus}
>
  Sign Up
</Link>

              <Link
                className="rdn-primary"
                to="/login"
                onClick={closeMenus}
              >
                <CalendarDays
                  size={18}
                  aria-hidden="true"
                />
                Book a Table
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                />
              </Link>
            </>
          ) : (
            <>
              {hasDashboard && (
                <NavLink
                  className="rdn-primary"
                  to={dashboard}
                  onClick={closeMenus}
                >
                  <CalendarDays
                    size={18}
                    aria-hidden="true"
                  />

                  {isAdmin
                    ? "Admin Dashboard"
                    : "My Reservations"}
                </NavLink>
              )}

              <div
                className="rdn-account"
                ref={accountRef}
              >
                <button
                  type="button"
                  ref={accountToggle}
                  className="rdn-account-toggle"
                  aria-expanded={accountOpen}
                  aria-controls={accountId}
                  onClick={() =>
                    setAccountOpen((open) => !open)
                  }
                >
                  <UserRound
                    size={18}
                    aria-hidden="true"
                  />

                  {isAdmin ? "Admin" : "My Account"}

                  <ChevronDown
                    size={15}
                    aria-hidden="true"
                  />
                </button>

                <div
                  id={accountId}
                  className="rdn-dropdown"
                  hidden={!accountOpen}
                >
                  <span className="rdn-account-label">
                    {isAdmin
                      ? "Restaurant administration"
                      : "Guest account"}
                  </span>

                  {hasDashboard && (
                    <Link
                      to={dashboard}
                      onClick={closeMenus}
                    >
                      <LayoutDashboard
                        size={17}
                        aria-hidden="true"
                      />

                      {isAdmin
                        ? "Admin Dashboard"
                        : "User Dashboard"}
                    </Link>
                  )}

                  <button
                    type="button"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                  >
                    <LogOut
                      size={17}
                      aria-hidden="true"
                    />

                    {isLoggingOut
                      ? "Logging out…"
                      : "Sign Out"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SHOPPING CART AND MOBILE MENU */}
      <div className="rdn-quick-actions">
        <Link
          to="/food-recommendations?cart=1"
          className={`rdn-cart-link ${
            cartCount > 0 ? "has-items" : ""
          }`}
          onClick={closeMenus}
          aria-label={`View shopping cart, ${cartCount} items`}
        >
          <span className="rdn-cart-icon">
            <ShoppingBag
              size={22}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {cartCount > 0 && (
              <span
                className="rdn-cart-count"
                key={cartCount}
                aria-hidden="true"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </span>

          <span className="rdn-cart-text">
            Cart
          </span>
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="rdn-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={
            menuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          onClick={() => {
            setMenuOpen((open) => !open);
            setAccountOpen(false);
          }}
        >
          {menuOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
}
