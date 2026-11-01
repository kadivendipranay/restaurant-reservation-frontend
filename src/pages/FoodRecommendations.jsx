
import { useEffect, useMemo, useState } from "react";

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
  budget: "500",
  search: "",
  sort: "recommended",
};

// Reusable image component with fallback support
function FoodImage({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(
    src || LOCAL_FOOD_IMAGE
  );
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
        <div
          className="fr-image-placeholder"
          role="img"
          aria-label={alt}
        >
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

  // Filter and sort menu items
  const foods = useMemo(() => {
    const term = search.trim().toLowerCase();
    const maximumPrice = Number(budget);

    const result = menuData.filter((food) => {
      const matchesType =
        type === "All" || food.type === type;

      const matchesCategory =
        category === "All" ||
        food.category === category;

      const matchesSpice =
        spice === "Any" || food.spice === spice;

      const matchesBudget =
        Number.isFinite(maximumPrice) &&
        Number(food.price) <= maximumPrice;

      const searchableText = [
        food.name,
        food.description,
        food.category,
        food.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !term || searchableText.includes(term);

      return (
        matchesType &&
        matchesCategory &&
        matchesSpice &&
        matchesBudget &&
        matchesSearch
      );
    });

    // Sort filtered results without modifying menuData
    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [type, category, spice, budget, search, sort]);

  // Count actual filters, excluding sorting
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
    <main className="fr-page">

      {/* HERO SECTION */}
      <section className="fr-hero">
        <div className="fr-hero-content">
          <span className="fr-eyebrow">
            ✦ THE ART OF GOOD FOOD
          </span>

          <h1>
            Find your next
            <br />
            <span>favourite dish.</span>
          </h1>

          <p>
            From comforting classics to irresistible treats,
            discover something delicious for every craving
            and every budget.
          </p>

          <div className="fr-hero-points">
            <span>✓ Your taste</span>
            <span>✓ Your budget</span>
            <span>✓ Your choice</span>
          </div>

          <a className="fr-hero-cta" href="#fr-menu">
            Explore our menu
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
            <span>MADE FRESH</span>
          </div>
        </div>
      </section>

      {/* DISCOVERY AND FILTERS */}
      <section className="fr-discovery">
        <div className="fr-section-heading">
          <div>
            <span className="fr-kicker">
              YOUR PERSONAL MENU
            </span>

            <h2>What are you craving?</h2>

            <p>
              Make your selection and discover your perfect dish.
            </p>
          </div>

          <button
            type="button"
            className="fr-reset"
            onClick={resetFilters}
            disabled={
              activeFilterCount === 0 &&
              sort === "recommended"
            }
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
            onChange={(event) =>
              setSearch(event.target.value)
            }
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

        {/* FILTERS */}
        <div className="fr-filters">
          <label>
            <span>Food preference</span>

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
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
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {MENU_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All categories"
                    : item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Spice level</span>

            <select
              value={spice}
              onChange={(event) =>
                setSpice(event.target.value)
              }
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
              onChange={(event) =>
                setBudget(event.target.value)
              }
            >
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
              onChange={(event) =>
                setSort(event.target.value)
              }
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
              {activeFilterCount} active{" "}
              {activeFilterCount === 1
                ? "filter"
                : "filters"}
            </span>

            <button
              type="button"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* FOOD MENU */}
      <section className="fr-menu" id="fr-menu">
        <div className="fr-menu-heading">
          <div>
            <span className="fr-kicker">
              MADE TO BE ENJOYED
            </span>

            <h2>
              Explore the menu<span>.</span>
            </h2>

            <p>
              Discover flavours made to make every meal special.
            </p>
          </div>

          <div
            className="fr-result-count"
            aria-live="polite"
          >
            <strong>{foods.length}</strong>
            {foods.length === 1
              ? " dish found"
              : " dishes found"}
          </div>
        </div>

        {foods.length > 0 ? (
          <div className="fr-grid">
            {foods.map((food) => (
              <article
                className="fr-card"
                key={food.id}
              >
                <div className="fr-card-photo">
                  <FoodImage
                    src={food.image}
                    alt={food.name}
                  />

                  <span
                    className={`fr-type ${
                      food.type === "Veg"
                        ? "fr-veg"
                        : "fr-nonveg"
                    }`}
                  >
                    <i aria-hidden="true" />
                    {food.type === "Veg"
                      ? "VEG"
                      : "NON-VEG"}
                  </span>

                  <span className="fr-card-category">
                    {food.category}
                  </span>
                </div>

                <div className="fr-card-content">
                  <div className="fr-card-title-row">
                    <h3>{food.name}</h3>

                    <strong>
                      {formatMenuPrice(food.price)}
                    </strong>
                  </div>

                  <p className="fr-description">
                    {food.description ||
                      "A delicious restaurant favourite."}
                  </p>

                  <div className="fr-card-meta">
                    <span>
                      🌶 {food.spice || "Regular"}
                    </span>

                    <span>
                      {food.price <= 150
                        ? "Budget friendly"
                        : "Special selection"}
                    </span>
                  </div>

                  <div className="fr-card-bottom">
                    <span>Discover your taste</span>

                    <span
                      className="fr-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
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
              We couldn't find a match. Try another search
              or adjust your filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
            >
              Show all dishes
            </button>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="fr-footer">
        <span aria-hidden="true">✦</span>
        <p>Made with a love for good food.</p>
      </footer>

    </main>
  );
}
