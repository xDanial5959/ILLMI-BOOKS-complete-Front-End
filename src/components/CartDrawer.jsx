"use client";

import { useCart } from "@/context/CartContext";
import { X, Trash2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const {
    cart,
    subtotal,
    totalItems,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  return (
    <>
      {/* Modern translucent overlay with blur */}
      <div
        className={`fixed inset-0 bg-white/30 backdrop-blur-md z-40 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Enhanced Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Staggered entrance for header */}
          <div
            className={`flex justify-between items-center p-6 border-b border-gray-100 transition-all duration-300 ease-in-out ${
              isOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 delay-100"
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-900">
              Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              aria-label="Close cart"
            >
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {/* Cart Items with smooth entrance */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div
                className={`text-center py-12 text-gray-400 transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 delay-150"
                }`}
              >
                Your cart is empty
              </div>
            ) : (
              <ul className="space-y-4">
                {cart.map((item, index) => (
                  <li
                    key={item.id}
                    className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ease-in-out hover:-translate-y-0.5 ${
                      isOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
                    style={{
                      transitionDelay: isOpen ? `${150 + index * 50}ms` : "0ms",
                    }}
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Rs.{item.salePrice.toLocaleString()}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-gray-200 rounded-full">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-3 cursor-pointer py-1 text-gray-600 hover:bg-gray-50 rounded-l-full transition-colors disabled:opacity-40"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-2 py-1 text-sm font-medium text-gray-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1 cursor-pointer text-gray-600 hover:bg-gray-50 rounded-r-full transition-colors disabled:opacity-40"
                              disabled={item.quantity >= 10}
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Staggered footer */}
          {cart.length > 0 && (
            <div
              className={`border-t border-gray-100 p-6 transition-all duration-300 ease-in-out ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 delay-200"
              }`}
            >
              <div className="flex justify-between mb-6">
                <span className="font-medium text-gray-700">Subtotal:</span>
                <span className="font-bold text-gray-900">
                  Rs.{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="flex-1 py-3 cursor-pointer border border-gray-200 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all duration-200 font-medium text-gray-700"
                >
                  Clear Cart
                </button>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md font-medium"
                >
                  Checkout <ChevronRight size={16} className="mt-0.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
