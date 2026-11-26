import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { formatMenuPrice } from "../data/menuData";
import "../styles/Checkout.css";

const MODES = [
  { name: "Dine-in", icon: "🍽️", description: "Enjoy your meal at the restaurant" },
  { name: "Takeaway", icon: "🥡", description: "Collect your meal at the counter" },
  { name: "Delivery", icon: "🛵", description: "Request delivery to your address" },
];

export default function Checkout() {
  const { cartItems, cartCount, subtotal, addToCart, decreaseQuantity } = useCart();
  const location = useLocation();
  const [mode, setMode] = useState(() => MODES.some(m => m.name === location.state?.orderType) ? location.state.orderType : "Takeaway");
  const [details, setDetails] = useState({ name: "", phone: "", address: "", pin: "", notes: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const update = (event) => {
    const { name, value } = event.target;
    setDetails(previous => ({ ...previous, [name]: value }));
    setMessage(""); setError("");
  };
  function submit(event) {
    event.preventDefault();
    setMessage(""); setError("");
    if (!cartCount) return setError("Your bag is empty.");
    if (!details.name.trim()) return setError("Please enter your full name.");
    if (!/^[6-9]\d{9}$/.test(details.phone.trim())) return setError("Enter a valid 10-digit Indian mobile number.");
    if (mode === "Delivery" && (!details.address.trim() || !/^[1-9]\d{5}$/.test(details.pin.trim()))) return setError("Enter your complete delivery address and a valid six-digit PIN code.");
    setMessage("Checkout details validated. This is a preview only. No order has been placed and no payment has been collected.");
  }
  return (
    <div className="rd-checkout">
      <Navbar />
      <main className="rd-co-main">
        <Link className="rd-co-back" to="/food-recommendations?cart=1">← Back to your bag</Link>
        <header className="rd-co-hero"><span>RESERVEDINE · YOUR NEXT MEAL</span><h1>Make it delicious.</h1><p>Choose how you would like to enjoy your meal.</p></header>
        {!cartCount ? <section className="rd-co-panel rd-co-empty"><h2>Your bag is empty</h2><p>Explore our menu to find something delicious.</p><Link className="rd-co-button" to="/food-recommendations">Explore menu</Link></section> : (
          <form className="rd-co-grid" onSubmit={submit} noValidate>
            <div className="rd-co-fields">
              <section className="rd-co-panel"><h2>01. Meal preference</h2><div className="rd-co-modes">{MODES.map(item => <button type="button" key={item.name} aria-pressed={mode === item.name} onClick={() => {setMode(item.name);setMessage("");setError("");}}><span aria-hidden="true">{item.icon}</span><strong>{item.name}</strong><small>{item.description}</small></button>)}</div></section>
              <section className="rd-co-panel"><h2>02. Customer details</h2><div className="rd-co-inputs"><label>Full name<input name="name" autoComplete="name" value={details.name} onChange={update} required maxLength={100} placeholder="Your full name" /></label><label>Mobile number<input name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" value={details.phone} onChange={update} required maxLength={10} placeholder="10-digit mobile number" /></label></div>
              {mode === "Delivery" && <div className="rd-co-inputs"><label className="rd-co-wide">Delivery address<textarea name="address" autoComplete="street-address" value={details.address} onChange={update} required maxLength={500} rows={3} placeholder="House number, street, area and city" /></label><label>PIN code<input name="pin" inputMode="numeric" autoComplete="postal-code" value={details.pin} onChange={update} required maxLength={6} placeholder="6-digit PIN code" /></label></div>}
              <label>Cooking instructions (optional)<textarea name="notes" value={details.notes} onChange={update} maxLength={300} rows={3} placeholder="Less spicy, no onions, etc." /></label><small className="rd-co-muted">Requests are subject to restaurant confirmation.</small></section>
              <section className="rd-co-panel"><h2>03. Payment</h2><p>Payment options will be available after order and payment integration.</p><div className="rd-co-notice">No payment is required for this checkout preview.</div></section>
            </div>
            <aside className="rd-co-panel rd-co-summary"><span className="rd-co-kicker">FRESH FROM OUR KITCHEN</span><h2>Your order</h2><p>{cartCount} {cartCount === 1 ? "item" : "items"} · {mode}</p>
              {cartItems.map(food => <div className="rd-co-item" key={food.id}><img src={food.image} alt="" loading="lazy" onError={e => {if (!e.currentTarget.dataset.fallback) {e.currentTarget.dataset.fallback = "1";e.currentTarget.src = "/images/food-spread.avif";}}}/><div className="rd-co-item-info"><strong>{food.name}</strong><small>{formatMenuPrice(food.price)} each</small><div className="rd-co-qty"><button type="button" aria-label={`Remove one ${food.name}`} onClick={() => {decreaseQuantity(food.id);setMessage("");setError("");}}>−</button><span>{food.quantity}</span><button type="button" disabled={food.quantity >= 99} aria-label={`Add one ${food.name}`} onClick={() => {addToCart(food.id);setMessage("");setError("");}}>+</button></div></div><strong>{formatMenuPrice(food.totalPrice)}</strong></div>)}
              <div className="rd-co-bill"><div><span>Item subtotal</span><strong>{formatMenuPrice(subtotal)}</strong></div><div><span>Taxes / delivery fees</span><small>Not configured</small></div><div className="rd-co-total"><span>Subtotal</span><strong>{formatMenuPrice(subtotal)}</strong></div></div>
              {error && <p className="rd-co-error" role="alert">{error}</p>}{message && <p className="rd-co-notice" role="status">{message}</p>}
              <button className="rd-co-button" type="submit">Review order · {formatMenuPrice(subtotal)} →</button><small className="rd-co-muted">Preview only · No real orders or payments</small>
            </aside>
          </form>
        )}
      </main>
    </div>
  );
}
