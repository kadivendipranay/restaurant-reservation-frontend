
import { useEffect, useMemo, useState } from "react";
import { menuData } from "../data/menuData";
import "../styles/FoodRecommendations.css";

const DEFAULTS = {
  type: "All",
  category: "All",
  spice: "Any",
  budget: "500",
  search: "",
  sort: "recommended",
};

function FoodImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className="fr-image-wrap">
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          className="fr-food-image"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="fr-image-placeholder">
          <span>🍽️</span>
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

  const categories = useMemo(
    () => [
      ...new Set(
        menuData.map((food) => food.category).filter(Boolean)
      ),
    ].sort(),
    []
  );

  const foods = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = menuData.filter((food) => {
      const matchesType =
        type === "All" || food.type === type;

      const matchesCategory =
        category === "All" || food.category === category;

      const matchesSpice =
        spice === "Any" || food.spice === spice;

      const matchesBudget =
        Number(food.price) <= Number(budget);

      const text = [
        food.name,
        food.description,
        food.category,
        food.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesType &&
        matchesCategory &&
        matchesSpice &&
        matchesBudget &&
        (!term || text.includes(term))
      );
    });

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [type, category, spice, budget, search, sort]);

  function resetFilters() {
    setType(DEFAULTS.type);
    setCategory(DEFAULTS.category);
    setSpice(DEFAULTS.spice);
    setBudget(DEFAULTS.budget);
    setSearch(DEFAULTS.search);
    setSort(DEFAULTS.sort);
  }

  return (
    <main className="fr-page">
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
        </div>

        <div className="fr-hero-art">
          <img
            src="/images/food-spread.avif"
            alt="A selection of delicious food"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <div className="fr-hero-note">
            <span>GOOD FOOD</span>
            <strong>Good mood.</strong>
          </div>
        </div>
      </section>

      <section className="fr-discovery">
        <div className="fr-section-heading">
          <div>
            <span className="fr-kicker">YOUR PERSONAL MENU</span>
            <h2>What are you craving?</h2>
            <p>Make your selection and discover your perfect dish.</p>
          </div>

          <button
            type="button"
            className="fr-reset"
            onClick={resetFilters}
          >
            ↺ Reset all
          </button>
        </div>

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
            <button type="button" onClick={() => setSearch("")}>
              Clear
            </button>
          )}
        </div>

        <div className="fr-filters">
          <label>
            <span>Food preference</span>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="All">All foods</option>
              <option value="Veg">Vegetarian</option>
              <option value="Non-Veg">Non-vegetarian</option>
            </select>
          </label>

          <label>
            <span>Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Spice level</span>
            <select value={spice} onChange={(e) => setSpice(e.target.value)}>
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
              onChange={(e) => setBudget(e.target.value)}
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
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
        </div>
      </section>

      <section className="fr-menu">
        <div className="fr-menu-heading">
          <div>
            <span className="fr-kicker">MADE TO BE ENJOYED</span>
            <h2>Explore the menu<span>.</span></h2>
          </div>
          <div className="fr-result-count">
            {foods.length} {foods.length === 1 ? "dish" : "dishes"}
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
                    <i />
                    {food.type === "Veg" ? "VEG" : "NON-VEG"}
                  </span>

                  <span className="fr-card-category">
                    {food.category}
                  </span>
                </div>

                <div className="fr-card-content">
                  <div className="fr-card-title-row">
                    <h3>{food.name}</h3>
                    <strong>₹{Number(food.price).toLocaleString("en-IN")}</strong>
                  </div>

                  <p className="fr-description">
                    {food.description || "A delicious restaurant favourite."}
                  </p>

                  <div className="fr-card-meta">
                    <span>🌶 {food.spice || "Regular"}</span>
                    <span>
                      {Number(food.price) <= 150
                        ? "Budget friendly"
                        : "Guest favourite"}
                    </span>
                  </div>

                  <div className="fr-card-bottom">
                    <span>Discover your taste</span>
                    <span className="fr-arrow" aria-hidden="true">↗</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="fr-empty">
            <span>🍽️</span>
            <h3>No dishes found</h3>
            <p>Try another search or change your filters.</p>
            <button type="button" onClick={resetFilters}>
              Show all dishes
            </button>
          </div>
        )}
      </section>

      <footer className="fr-footer">
        <span>✦</span>
        <p>Made with a love for good food.</p>
      </footer>
    </main>
  );
}
