
import { useMemo, useState } from "react";
import { menuData } from "../data/menuData";
import "../styles/FoodRecommendations.css";

export default function FoodRecommendations() {
  const [foodType, setFoodType] = useState("All");
  const [budget, setBudget] = useState("300");
  const [spice, setSpice] = useState("Any");
  const [category, setCategory] = useState("All");

  const recommendations = useMemo(() => {
    return menuData.filter((food) => {
      const matchesType =
        foodType === "All" || food.type === foodType;

      const matchesBudget = food.price <= Number(budget);

      const matchesSpice =
        spice === "Any" || food.spice === spice;

      const matchesCategory =
        category === "All" || food.category === category;

      return (
        matchesType &&
        matchesBudget &&
        matchesSpice &&
        matchesCategory
      );
    });
  }, [foodType, budget, spice, category]);

  return (
    <main className="food-page">
      <section className="food-hero">
        <p className="food-eyebrow">PERSONALIZED FOOD PICKS</p>
        <h1>Find Your Perfect Dish</h1>
        <p>
          Choose your preferences and discover dishes that match
          your taste and budget.
        </p>
      </section>

      <section className="food-filters">
        <div className="food-filter">
          <label htmlFor="food-type">Food preference</label>
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
          <label htmlFor="food-budget">Maximum budget</label>
          <select
            id="food-budget"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
          >
            <option value="100">₹100</option>
            <option value="150">₹150</option>
            <option value="200">₹200</option>
            <option value="250">₹250</option>
            <option value="300">₹300</option>
          </select>
        </div>

        <div className="food-filter">
          <label htmlFor="food-spice">Spice level</label>
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
          <label htmlFor="food-category">Category</label>
          <select
            id="food-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="All">All categories</option>
            <option value="Starter">Starters</option>
            <option value="Main Course">Main course</option>
            <option value="Dessert">Desserts</option>
          </select>
        </div>
      </section>

      <section className="food-results">
        <div className="food-results-heading">
          <h2>Recommended for You</h2>
          <span>{recommendations.length} dishes found</span>
        </div>

        {recommendations.length > 0 ? (
          <div className="food-grid">
            {recommendations.map((food) => (
              <article className="food-card" key={food.id}>
                <div className="food-card-top">
                  <span className="food-category">
                    {food.category}
                  </span>
                  <span className="food-price">
                    ₹{food.price}
                  </span>
                </div>

                <h3>{food.name}</h3>
                <p>{food.description}</p>

                <div className="food-tags">
                  <span>{food.type}</span>
                  <span>{food.spice} spice</span>
                </div>

                <p className="food-reason">
                  {food.price <= 150
                    ? "Budget-friendly pick"
                    : "Matches your selected preferences"}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="food-empty">
            <h3>No matching dishes</h3>
            <p>Try increasing your budget or changing your filters.</p>
            <button
              type="button"
              onClick={() => {
                setFoodType("All");
                setBudget("300");
                setSpice("Any");
                setCategory("All");
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
