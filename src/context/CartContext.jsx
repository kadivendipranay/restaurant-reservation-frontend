//CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { menuData } from "../data/menuData";

const CartContext = createContext(null);
const KEY = "reservedine.cart.v1";
const PREVIOUS_KEY = "reservedine_global_cart";
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? localStorage.getItem(PREVIOUS_KEY) ?? "{}");
    return Object.fromEntries(menuData.map(food => [food.id, saved?.[food.id]])
      .filter(([, q]) => Number.isInteger(q) && q > 0 && q <= 99));
  } catch { return {}; }
}
export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* session only */ }
  }, [cart]);
  function changeQuantity(id, delta) {
    id = Number(id);
    if (!menuData.some(food => food.id === id)) return;
    setCart(previous => {
      const next = { ...previous };
      const quantity = Math.max(0, Math.min(99, (next[id] || 0) + delta));
      if (quantity) next[id] = quantity; else delete next[id];
      return next;
    });
  }
  const addToCart = id => changeQuantity(id, 1);
  const decreaseQuantity = id => changeQuantity(id, -1);
  const removeFromCart = id => setCart(previous => {
    const next = { ...previous }; delete next[Number(id)]; return next;
  });
  const clearCart = () => setCart({});
  const getQuantity = id => cart[Number(id)] || 0;
  const cartItems = useMemo(() => menuData.filter(food => cart[food.id] > 0)
    .map(food => ({ ...food, quantity: cart[food.id], totalPrice: Number(food.price) * cart[food.id] })), [cart]);
  const cartCount = cartItems.reduce((sum, food) => sum + food.quantity, 0);
  const subtotal = cartItems.reduce((sum, food) => sum + food.totalPrice, 0);
  return <CartContext.Provider value={{ cart, cartItems, cartCount, subtotal, addToCart, decreaseQuantity, removeFromCart, clearCart, getQuantity }}>{children}</CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
