import { useMemo, useState } from "react";
import { menuData } from "../data/menuData";
import "../styles/FoodRecommendations.css";

const INITIAL_FILTERS = {
  foodType: "All",
  budget: "300",
  spice: "Any",
  category: "All",
};

function FoodImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`food-image-wrap ${className}`}>
      {src && !failed ? (
        <img
          className="food-card-image"
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="food-image-placeholder" role="img" aria-label={alt}>
          <span aria-hidden="true">🍽️</span>
          <small>Image unavailable</small>
        </div>
      )}
    </div>
  );
}

export default function FoodRecommendations() {
  const [foodType, setFoodType] = useState(INITIAL_FILTERS.foodType);
  const [budget, setBudget] = useState(INITIAL_FILTERS.budget);
  const [spice, setSpice] = useState(INITIAL_FILTERS.spice);
  const [category, setCategory] = useState(INITIAL_FILTERS.category);
  const [heroImageFailed, setHeroImageFailed] = useState(false);

  const recommendations = useMemo(() => {
    if (!Array.isArray(menuData)) return [];

    const maxBudget = Number(budget);

    return menuData.filter((food) => {
      if (!food || typeof food !== "object") return false;

      const price = Number(food.price);

      return (
        (foodType === "All" || food.type === foodType) &&
        Number.isFinite(price) &&
        price >= 0 &&
        price <= maxBudget &&
        (spice === "Any" || food.spice === spice) &&
        (category === "All" || food.category === category)
      );
    });
  }, [foodType, budget, spice, category]);

  const resetFilters = () => {
    setFoodType(INITIAL_FILTERS.foodType);
    setBudget(INITIAL_FILTERS.budget);
    setSpice(INITIAL_FILTERS.spice);
    setCategory(INITIAL_FILTERS.category);
  };

  return (
    <main className="food-page">
      {/* HERO SECTION */}
      <section className="food-hero food-hero-realistic">
        <div className="food-hero-content">
          <span className="food-hero-badge">
            ✦ YOUR PERSONAL FOOD GUIDE
          </span>

          <p className="food-eyebrow">
            ROYAL RESTAURANT · DISCOVER THE TASTE
          </p>

          <h1>
            Find Your Perfect <span>Dish.</span>
          </h1>

          <p className="food-hero-description">
            From delicious biryanis to irresistible desserts,
            discover dishes that match your taste, spice level,
            and budget.
          </p>

          <div className="food-hero-highlights">
            <span>✓ Fresh choices</span>
            <span>✓ Budget-friendly</span>
            <span>✓ Made for your taste</span>
          </div>
        </div>

        <div
          className={`food-hero-photo ${
            heroImageFailed ? "food-hero-photo-failed" : ""
          }`}
        >
          {!heroImageFailed ? (
            <img
  src="https://img.magnific.com/premium-photo/colorful-spread-aromatic-dishes-laid-out-table-from-birdseye-view-you-see-assortment-o_971975-18700.jpg?w=996"
  alt="Colorful assortment of restaurant dishes"
  onError={() => setHeroImageFailed(true)}
/>
          ) : (
            <div className="food-hero-image-placeholder">
              <span aria-hidden="true">🍛</span>
              <p>Discover delicious food</p>
              <small>
                Add restaurant-hero.png to the public/images folder.
              </small>
            </div>
          )}

          <span
            className="food-photo-badge food-photo-badge-one"
            aria-hidden="true"
          >
            🌿
          </span>

          <span
            className="food-photo-badge food-photo-badge-two"
            aria-hidden="true"
          >
            ✨
          </span>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section
        className="food-filters"
        aria-label="Filter food recommendations"
      >
        <div className="food-filter-heading">
          <div>
            <span className="food-section-kicker">PERSONALIZE</span>
            <h2>What are you craving?</h2>
            <p>Choose your preferences to find your perfect dish.</p>
          </div>

          <button
            type="button"
            className="food-clear-button"
            onClick={resetFilters}
          >
            ↻ Reset filters
          </button>
        </div>

        <div className="food-filter-grid">
          <div className="food-filter">
            <label htmlFor="food-type">
              <span aria-hidden="true">🥗</span>
              Food preference
            </label>

            <select
              id="food-type"
              value={foodType}
              onChange={(event) => setFoodType(event.target.value)}
            >
              <option value="All">All foods</option>
              <option value="Veg">Vegetarian</option>
              <option value="Non-Veg">Non-vegetarian</option>
            </select>
          </div>

          <div className="food-filter">
            <label htmlFor="food-budget">
              <span aria-hidden="true">₹</span>
              Maximum budget
            </label>

            <select
              id="food-budget"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
            >
              <option value="100">Up to ₹100</option>
              <option value="150">Up to ₹150</option>
              <option value="200">Up to ₹200</option>
              <option value="250">Up to ₹250</option>
              <option value="300">Up to ₹300</option>
            </select>
          </div>

          <div className="food-filter">
            <label htmlFor="food-spice">
              <span aria-hidden="true">🌶️</span>
              Spice level
            </label>

            <select
              id="food-spice"
              value={spice}
              onChange={(event) => setSpice(event.target.value)}
            >
              <option value="Any">Any spice level</option>
              <option value="Mild">Mild</option>
              <option value="Medium">Medium</option>
              <option value="Hot">Hot</option>
            </select>
          </div>

          <div className="food-filter">
            <label htmlFor="food-category">
              <span aria-hidden="true">🍽️</span>
              Category
            </label>

            <select
              id="food-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="All">All categories</option>
              <option value="Starter">Starters</option>
              <option value="Main Course">Main course</option>
              <option value="Dessert">Desserts</option>
              <option value="Beverage">Beverages</option>
            </select>
          </div>
        </div>
      </section>

      {/* FOOD RESULTS */}
      <section
        className="food-results"
        aria-labelledby="food-results-title"
      >
        <div className="food-results-heading">
          <div>
            <span className="food-section-kicker">CURATED FOR YOU</span>
            <h2 id="food-results-title">Delicious Discoveries</h2>
            <p className="food-results-subtitle">
              Good food, great taste, and choices you’ll love.
            </p>
          </div>

          <span className="food-count" aria-live="polite">
            {recommendations.length}{" "}
            {recommendations.length === 1 ? "dish" : "dishes"} found
          </span>
        </div>

        {recommendations.length > 0 ? (
          <div className="food-grid">
            {recommendations.map((food) => {
              const price = Number(food.price);
              const isVeg = food.type === "Veg";

              return (
                <article className="food-card" key={food.id}>
                  <div className="food-card-image-container">
                    <FoodImage
                      src={food.image}
                      alt={food.name || "Restaurant dish"}
                    />

                    <span
                      className={`food-image-label ${
                        isVeg ? "veg-label" : "nonveg-label"
                      }`}
                    >
                      <span aria-hidden="true">
                        {isVeg ? "🌱" : "🍗"}
                      </span>
                      {isVeg ? "VEG" : "NON-VEG"}
                    </span>
                  </div>

                  <div className="food-card-body">
                    <div className="food-card-top">
                      <span className="food-category">
                        {food.category || "Food"}
                      </span>

                      <span className="food-price">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <h3>{food.name || "Delicious Dish"}</h3>

                    <p className="food-description">
                      {food.description ||
                        "A delicious restaurant favourite."}
                    </p>

                    <div className="food-tags">
                      <span>
                        🌶️ {food.spice || "Regular"} spice
                      </span>

                      <span>
                        {price <= 150
                          ? "💚 Budget pick"
                          : "✨ Chef's choice"}
                      </span>
                    </div>

                    <div className="food-card-bottom">
                      <span>Made for your cravings</span>
                      <span className="food-card-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="food-empty">
            <div className="food-empty-icon" aria-hidden="true">
              🍽️
            </div>

            <h3>No matching dishes yet</h3>

            <p>
              Try increasing your budget or changing your filters
              to explore more dishes.
            </p>

            <button
              type="button"
              className="food-reset-button"
              onClick={resetFilters}
            >
              Explore all dishes
            </button>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="food-footer">
        <span className="food-footer-icon" aria-hidden="true">
          ✦
        </span>

        <p>Royal Restaurant</p>
        <span>Good food. Memorable experiences.</span>
      </footer>
    </main>
  );
}
