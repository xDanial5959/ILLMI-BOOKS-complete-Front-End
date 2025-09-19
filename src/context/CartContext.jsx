"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [buyNowItems, setBuyNowItems] = useState([]); // New: Buy Now support
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("bookstore-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookstore-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const addToCart = (book, quantity = 1, isBuyNow = false) => {
    if (isBuyNow) {
      setBuyNowItems([{ ...book, quantity }]);
      setToastMessage("Ready to checkout!");
      setShowToast(true);
      return;
    }

    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === book.id);
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, 10);
        setToastMessage(`Updated quantity to ${newQuantity}`);
        setShowToast(true);
        return prev.map((item) =>
          item.id === book.id ? { ...item, quantity: newQuantity } : item
        );
      }
      setToastMessage("Item added to cart!");
      setShowToast(true);
      return [...prev, { ...book, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    setToastMessage("Item removed from cart");
    setShowToast(true);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        buyNowItems, // Add to context
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in">
          {toastMessage}
          <button onClick={() => setShowToast(false)} className="ml-2">
            ×
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
