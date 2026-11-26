import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import {
  menuData,
  LOCAL_FOOD_IMAGE,
  MENU_CATEGORIES,
  formatMenuPrice,
} from "../data/menuData";
import "../styles/FoodRecommendations.css";

const DEFAULTS = {
  type: "All",
  category: "All",
  spice: "Any",
  budget: "all",
  search: "",
  sort: "recommended",
};

function FoodImage({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(src || LOCAL_FOOD_IMAGE);
  const [fallbackFailed, setFallbackFailed] = useState(false);

  useEffect(() => {
    setImageSrc(src || LOCAL_FOOD_IMAGE);
    setFallbackFailed(false);
  }, [src]);

  const handleImageError = () => {
    if (imageSrc !== LOCAL_FOOD_IMAGE) {
      setImageSrc(LOCAL_FOOD_IMAGE);
    } else {
      setFallbackFailed(true);
    }
  };

  return (
    <div className="fr-image-wrap">
      {!fallbackFailed ? (
        <img
          src={imageSrc}
          alt={alt}
          className="fr-food-image"
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
      ) : (
        <div className="fr-image-placeholder" role="img" aria-label={alt}>
          <span aria-hidden="true">🍽️</span>
          <small>{alt}</small>
        </div>
      )}
    </div>
  );
}

export default function FoodRecommendations() {
  const [type, setType] = useState(DEFAULTS.type);
  const [category, setCategory] = useState(DEFAULTS.category);
  const [spice, setSpice] = useState(DEFAULTS.spice);
  const [budget, setBudget] = useState(DEFAULTS.budget);
  const [search, setSearch] = useState(DEFAULTS.search);
  const [sort, setSort] = useState(DEFAULTS.sort);

  const { cart, cartItems, cartCount: count, subtotal: total, addToCart, decreaseQuantity, clearCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [orderType, setOrderType] = useState("Takeaway");
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollRequest, setScrollRequest] = useState(0);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("cart") === "1") {
      setCartOpen(true);
      setScrollRequest(value => value + 1);
    }
  }, [location.search, location.key]);

  useEffect(() => {
    if (!cartOpen || !scrollRequest) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("fr-cart")?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [cartOpen, scrollRequest]);
  function changeQuantity(id, delta) {
    if (delta > 0) addToCart(id);
    else decreaseQuantity(id);
  }
  function quantityControl(food) {
    const quantity = cart[food.id] || 0;
    return quantity ? (
      <div className="fr-quantity">
        <button type="button" aria-label={`Remove one ${food.name}`} onClick={() => changeQuantity(food.id, -1)}>−</button>
        <span aria-live="polite">{quantity}</span>
        <button type="button" disabled={quantity >= 99} aria-label={`Add one ${food.name}`} onClick={() => changeQuantity(food.id, 1)}>+</button>
      </div>
    ) : <button type="button" className="fr-add" onClick={() => changeQuantity(food.id, 1)} aria-label={`Add ${food.name} to cart`}>ADD +</button>;
  }
  function viewCart() {
    setCartOpen(true);
    setScrollRequest(value => value + 1);
  }

  const foods = useMemo(() => {
    const term = search.trim().toLowerCase();
    const maximumPrice = Number(budget);

    const result = (Array.isArray(menuData) ? menuData : []).filter((food) => {
      const matchesType = type === "All" || food.type === type;
      const matchesCategory =
        category === "All" || food.category === category;
      const matchesSpice = spice === "Any" || food.spice === spice;
      const itemPrice = Number(food.price);
      const matchesBudget =
        Number.isFinite(itemPrice) && itemPrice >= 0 &&
        (budget === "all" || itemPrice <= maximumPrice);

      const searchableText = [
        food.name,
        food.description,
        food.category,
        food.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !term || searchableText.includes(term);

      return (
        matchesType &&
        matchesCategory &&
        matchesSpice &&
        matchesBudget &&
        matchesSearch
      );
    });

    if (sort === "low") {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sort === "high") {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sort === "name") {
      result.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    }

    return result;
  }, [type, category, spice, budget, search, sort]);

  const activeFilterCount = [
    type !== "All",
    category !== "All",
    spice !== "Any",
    budget !== DEFAULTS.budget,
    search.trim() !== "",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setType(DEFAULTS.type);
    setCategory(DEFAULTS.category);
    setSpice(DEFAULTS.spice);
    setBudget(DEFAULTS.budget);
    setSearch(DEFAULTS.search);
    setSort(DEFAULTS.sort);
  };

  return (
    <div className={`fr-shell${count > 0 && !cartOpen ? " fr-has-cart" : ""}`}>
      <Navbar />

      <main className="fr-page">
        {/* HERO SECTION */}
        <section className="fr-hero">
          <div className="fr-hero-content">
            <span className="fr-eyebrow">✦ THE ART OF GOOD FOOD</span>

            <h1>
              A taste of
              <br />
              <span>something special.</span>
            </h1>

            <p>
              From comforting classics to irresistible treats, discover something
              delicious for every craving and every budget.
            </p>

            <div className="fr-hero-points">
              <span>Indian favourites</span>
              <span>Vegetarian choices</span>
              <span>Dine-in & takeaway</span>
            </div>

            <a className="fr-hero-cta" href="#fr-menu" onClick={event => { event.preventDefault(); document.getElementById("fr-menu")?.scrollIntoView({ block: "start" }); }}>
              Explore & order
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="fr-hero-art">
            <img
              src={LOCAL_FOOD_IMAGE}
              alt="A selection of delicious restaurant food"
              fetchPriority="high"
              onError={(event) => {
                event.currentTarget.style.visibility = "hidden";
              }}
            />

            <div className="fr-hero-note">
              <span>GOOD FOOD</span>
              <strong>Good mood.</strong>
            </div>

            <div className="fr-hero-stamp" aria-hidden="true">
              ✦
              <span>OUR MENU</span>
            </div>
          </div>
        </section>

        {/* DISCOVERY AND FILTERS */}
        <section className="fr-discovery">
          <div className="fr-section-heading">
            <div>
              <span className="fr-kicker">THE RESERVEDINE MENU</span>
              <h2>What are you craving?</h2>
              <p>Make your selection and discover your perfect dish.</p>
            </div>

            <button
              type="button"
              className="fr-reset"
              onClick={resetFilters}
              disabled={activeFilterCount === 0 && sort === "recommended"}
            >
              ↺ Reset all
            </button>
          </div>

          {/* SEARCH */}
          <div className="fr-search">
            <span aria-hidden="true">⌕</span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search biryani, paneer, dessert..."
              aria-label="Search food"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <nav className="fr-category-tabs" aria-label="Menu categories">
            {MENU_CATEGORIES.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item === "All" ? "Full menu" : item}</button>)}
          </nav>
          {/* FILTERS */}
          <div className="fr-filters">
            <label>
              <span>Food preference</span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="All">All foods</option>
                <option value="Veg">Vegetarian</option>
                <option value="Non-Veg">Non-vegetarian</option>
              </select>
            </label>

            <label>
              <span>Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {MENU_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All categories" : item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Spice level</span>
              <select
                value={spice}
                onChange={(event) => setSpice(event.target.value)}
              >
                <option value="Any">Any spice level</option>
                <option value="Mild">Mild</option>
                <option value="Medium">Medium</option>
                <option value="Hot">Hot</option>
              </select>
            </label>

            <label>
              <span>Maximum price</span>
              <select
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
              >
                <option value="all">Any price</option>
                <option value="50">Up to ₹50</option>
                <option value="100">Up to ₹100</option>
                <option value="150">Up to ₹150</option>
                <option value="200">Up to ₹200</option>
                <option value="300">Up to ₹300</option>
                <option value="500">Up to ₹500</option>
              </select>
            </label>

            <label>
              <span>Sort by</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>

          {activeFilterCount > 0 && (
            <div className="fr-active-filters">
              <span>
                {activeFilterCount}{" "}
                {activeFilterCount === 1 ? "filter" : "filters"} active
              </span>

              <button type="button" onClick={resetFilters}>
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* FOOD MENU */}
        <section className="fr-menu" id="fr-menu">
          <div className="fr-menu-heading">
            <div>
              <span className="fr-kicker">MADE TO BE ENJOYED</span>
              <h2>
                Explore the menu<span>.</span>
              </h2>
              <p>Discover flavours made to make every meal special.</p>
            </div>

            <div className="fr-result-count" aria-live="polite">
              <strong>{foods.length}</strong>
              {foods.length === 1 ? " dish found" : " dishes found"}
            </div>
          </div>

          {foods.length > 0 ? (
            <div className="fr-grid">
              {foods.map((food) => (
                <article className="fr-card" key={food.id}>
                  <div className="fr-card-photo">
                    <FoodImage src={food.image} alt={food.name} />

                    <span
                      className={`fr-type ${
                        food.type === "Veg" ? "fr-veg" : "fr-nonveg"
                      }`}
                    >
                      <i aria-hidden="true" />
                      {food.type === "Veg" ? "VEG" : "NON-VEG"}
                    </span>

                    <span className="fr-card-category">{food.category}</span>
                  </div>

                  <div className="fr-card-content">
                    <div className="fr-card-title-row">
                      <h3>{food.name}</h3>
                      <strong>{formatMenuPrice(food.price)}</strong>
                    </div>

                    <p className="fr-description">
                      {food.description || "A delicious restaurant favourite."}
                    </p>

                    <div className="fr-card-meta">
                      <span>🌶 {food.spice || "Regular"}</span>
                      <span>
                        {Number(food.price) <= 150
                          ? "Budget friendly"
                          : "Special selection"}
                      </span>
                    </div>

                    <div className="fr-card-bottom">
                      <span>{cart[food.id] ? "In your cart" : "Add to your bag"}</span>
                      {quantityControl(food)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="fr-empty">
              <span aria-hidden="true">🍽️</span>
              <h3>No dishes found</h3>
              <p>
                We couldn't find a match. Try another search or adjust your
                filters.
              </p>
              <button type="button" onClick={resetFilters}>
                Show all dishes
              </button>
            </div>
          )}
        </section>

        {cartOpen && (
          <section className="fr-cart" id="fr-cart" aria-labelledby="fr-cart-title">
            <div className="fr-menu-heading">
              <div><span className="fr-kicker">YOUR SELECTION</span><h2 id="fr-cart-title">Your order</h2></div>
              <button type="button" className="fr-reset" onClick={() => setCartOpen(false)}>Close</button>
            </div>
            {cartItems.length ? <>
              {cartItems.map(food => (
                <div className="fr-cart-row" key={food.id}>
                  <div className="fr-cart-dish"><FoodImage src={food.image} alt={food.name} /><div><strong>{food.name}</strong><p>{formatMenuPrice(food.price)} each</p></div></div>
                  {quantityControl(food)}
                  <strong>{formatMenuPrice(Number(food.price) * cart[food.id])}</strong>
                </div>
              ))}
              <fieldset className="fr-order-type">
                <legend>How would you like your meal?</legend>
                <div className="fr-order-options">
                  {[
                    { name: "Takeaway", icon: "🥡", description: "Pick up your favourites" },
                    { name: "Dine-in", icon: "🍽️", description: "Enjoy at our restaurant" },
                    { name: "Delivery", icon: "🛵", description: "Delivery preview" },
                  ].map((option) => (
                    <button
                      type="button"
                      key={option.name}
                      className={`fr-order-option${orderType === option.name ? " selected" : ""}`}
                      aria-pressed={orderType === option.name}
                      onClick={() => setOrderType(option.name)}
                    >
                      <span className="fr-order-icon" aria-hidden="true">{option.icon}</span>
                      <strong>{option.name}</strong>
                      <small>{option.description}</small>
                      {orderType === option.name && <span className="fr-order-check" aria-hidden="true">✓</span>}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="fr-cart-total"><strong>Item subtotal</strong><strong>{formatMenuPrice(total)}</strong></div>
              <button
                type="button"
                className="fr-checkout-btn"
                disabled={count === 0}
                onClick={() => navigate("/checkout", { state: { orderType } })}
              >
                Proceed to Checkout · {formatMenuPrice(total)} →
              </button>
              <p className="fr-cart-note">Checkout preview only. Orders, taxes, delivery charges and payments are not connected yet.</p>
              <button type="button" className="fr-reset" onClick={clearCart}>Clear cart</button>
            </> : <div className="fr-empty"><h3>Your bag is empty</h3><p>Discover something delicious from our menu.</p><button type="button" onClick={() => { setCartOpen(false); document.getElementById("fr-menu")?.scrollIntoView({block:"start"}); }}>Explore menu</button></div>}
          </section>
        )}
       {count > 0 && !cartOpen &&  <aside className="fr-cart-bar" aria-label="Cart summary"><div><span>{count} {count === 1 ? "item" : "items"} in your bag</span><strong>{formatMenuPrice(total)}</strong></div><button type="button" onClick={viewCart}>View bag →</button></aside>}
        {/* FOOTER */}
        <footer className="fr-footer">
          <span aria-hidden="true">✦</span>
          <p>Made with a love for good food.</p>
          <span>Designed &amp; Developed by Kadivendi Pranay Kumar · ReserveDine</span>
        </footer>
      </main>
    </div>
  );
}

