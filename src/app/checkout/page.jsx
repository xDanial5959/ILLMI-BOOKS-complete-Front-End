"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  Truck,
  Home,
  AlertCircle,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { bookData } from "@/data/bookData";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    country: "Pakistan",
    phone: "",
    saveInfo: false,
  });
  const errorRef = useRef(null);
  const {
    cart,
    buyNowItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToCart,
  } = useCart();

  // Calculate totals
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  );
  const buyNowSubtotal = buyNowItems.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  );
  const subtotal = cartSubtotal + buyNowSubtotal;
  const shippingCost = 250;
  const total = subtotal + shippingCost;

  // Handle direct "Buy Now" from product page
  useEffect(() => {
    const bookId = searchParams.get("bookId");
    if (bookId) {
      const book = bookData.find((b) => b.id === parseInt(bookId));
      const urlQuantity = searchParams.get("quantity") || 1;
      if (book) {
        localStorage.setItem(
          "checkout-items",
          JSON.stringify([
            {
              ...book,
              quantity: parseInt(urlQuantity),
            },
          ])
        );
      }
    }
  }, [searchParams]);

  // Scroll to error when it appears
  useEffect(() => {
    if (formError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [formError]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    updateQuantity(id, newQuantity);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate items in cart
    if (subtotal <= 0) {
      setFormError("Please add at least one item to proceed with checkout");
      return;
    }

    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.address ||
      !formData.city ||
      !formData.phone
    ) {
      setFormError("Please fill in all required fields");
      return;
    }

    setFormError("");

    // 1. Create the order object
    const newOrder = {
      id: Date.now(), // Timestamp ensures ID > placeholder IDs (1-2)
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        country: formData.country,
        phone: formData.phone,
      },
      items: [...cart, ...buyNowItems].map((item) => ({
        bookId: item.id,
        quantity: item.quantity,
        price: item.salePrice,
      })),
      subtotal: subtotal,
      shippingCost: 250,
      total: total,
      date: new Date().toISOString(),
      status: "Processing",
    };

    // 2. Save to localStorage (replaces placeholders if needed)
    const currentOrders = JSON.parse(localStorage.getItem("orders") || []);
    localStorage.setItem(
      "orders",
      JSON.stringify([...currentOrders, newOrder])
    );

    // 3. Save form data if user opted to
    if (formData.saveInfo) {
      localStorage.setItem("checkout-info", JSON.stringify(formData));
    }

    // 4. Clear cart and show success
    setShowSuccessModal(true);
    clearCart();

    setTimeout(() => {
      setShowSuccessModal(false);
      router.push("/");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button - Updated with modern look */}
        <div className="mb-6 animate-fade-in">
          <button
            onClick={() => router.back()}
            className="flex cursor-pointer items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <ArrowLeft className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:-translate-x-1" />
            </div>
            <span className="font-medium  text-sm bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent group-hover:underline underline-offset-4">
              Back to Previous Page
            </span>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in">
          Checkout
        </h1>

        {formError && (
          <div
            ref={errorRef}
            className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-sm animate-fade-in"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 animate-pulse" />
              <p className="text-red-700">{formError}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile: Order Summary at the top */}
          <div className="lg:hidden w-full">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 transition-all duration-300 hover:shadow-2xl animate-fade-in">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Buy Now Items */}
              {buyNowItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Your Purchase
                  </h3>
                  {buyNowItems.map((item, index) => (
                    <div
                      key={`buynow-${item.id}`}
                      className="flex items-start gap-4 border-b border-gray-100 pb-4 animate-fade-in"
                      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                    >
                      <div className="flex-shrink-0">
                        <div className="h-20 w-14 rounded-lg overflow-hidden shadow-sm border border-gray-100/50">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.title}
                        </h3>
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </span>
                          <div className="text-xs text-gray-400 mt-1">
                            Rs.{item.salePrice.toLocaleString()} ×{" "}
                            {item.quantity}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Rs.{(item.salePrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Cart Items */}
              {cart.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Your Cart Items
                  </h3>
                  {cart.map((item, index) => (
                    <div
                      key={`cart-${item.id}`}
                      className="flex items-start gap-4 border-b border-gray-100 pb-4 animate-fade-in"
                      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                    >
                      <div className="flex-shrink-0">
                        <div className="h-20 w-14 rounded-lg overflow-hidden shadow-sm border border-gray-100/50">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100/50 disabled:opacity-40 rounded-l-xl transition-all duration-200 hover:scale-110"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-4 py-1 text-center w-12 text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100/50 disabled:opacity-40 rounded-r-xl transition-all duration-200 hover:scale-110"
                              disabled={item.quantity >= 10}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-all duration-200 hover:bg-red-50/50 hover:scale-110"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Rs.{item.salePrice.toLocaleString()} × {item.quantity}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Rs.{(item.salePrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Order Totals */}
              <div className="border-t border-gray-200/50 pt-6 space-y-3 animate-fade-in">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">
                    Rs.{subtotal.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">
                    Rs.{shippingCost.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between border-t border-gray-200/50 pt-3">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-bold text-gray-900">
                    Rs.{total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column - Form */}
          <div className="lg:w-2/3 space-y-6">
            {/* Delivery Method */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.005] animate-fade-in">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="text-blue-500 w-5 h-5" />
                Delivery Method
              </h2>
              <div className="flex items-center space-x-3 cursor-pointer bg-gradient-to-r from-blue-50/50 to-blue-100/20 p-4 rounded-xl transition-all duration-300 hover:shadow-inner hover:from-blue-100/50">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Home className="text-blue-500 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Home Delivery</p>
                  <p className="text-sm text-gray-500">
                    Get your order delivered to your address
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.005] animate-fade-in">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="animate-fade-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border transition-all duration-300 hover:shadow-inner focus:shadow-md"
                    required
                  />
                </div>
                <div
                  className="animate-fade-in"
                  style={{ animationDelay: "0.15s" }}
                >
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border transition-all duration-300 hover:shadow-inner focus:shadow-md"
                    required
                  />
                </div>
              </div>

              <div
                className="mt-4 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country/Region *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value="Pakistan"
                  readOnly
                  className="w-full rounded-xl border-gray-200 shadow-sm bg-gray-100/50 p-3 border cursor-not-allowed"
                />
              </div>

              <div
                className="mt-4 animate-fade-in"
                style={{ animationDelay: "0.25s" }}
              >
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border transition-all duration-300 hover:shadow-inner focus:shadow-md"
                  required
                />
              </div>

              <div
                className="mt-4 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border transition-all duration-300 hover:shadow-inner focus:shadow-md"
                  required
                />
              </div>

              <div
                className="mt-4 animate-fade-in"
                style={{ animationDelay: "0.35s" }}
              >
                <label
                  htmlFor="apartment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border transition-all duration-300 hover:shadow-inner focus:shadow-md"
                />
              </div>

              <div
                className="mt-4 animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  WhatsApp Number *
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">+92</span>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border-gray-200 pl-12 focus:border-blue-500 focus:ring-blue-500 p-3 border transition-all duration-300 hover:shadow-inner focus:shadow-md"
                    placeholder="300 1234567"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Methods */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.005] animate-fade-in">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Methods
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 cursor-pointer bg-gradient-to-r from-gray-50 to-blue-50/20 p-4 rounded-xl transition-all duration-300 hover:shadow-inner">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Truck className="text-blue-500 w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Standard Rate</p>
                    <p className="text-sm text-gray-500">
                      Pakistan Post - 3-5 business days
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">Rs 250.00</p>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.005] animate-fade-in">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment
              </h2>
              <div className="bg-blue-50/50 p-4 rounded-xl mb-4 backdrop-blur-sm border border-blue-100/50">
                <p className="text-sm text-blue-700">
                  Cash on Delivery (COD) - Pay when you receive your order
                </p>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-blue-50/20 p-4 rounded-xl backdrop-blur-sm border border-gray-100/50 transition-all duration-300 hover:shadow-inner">
                <div className="p-3 bg-blue-100/50 rounded-xl backdrop-blur-sm border border-blue-200/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">
                    Pay with cash when your order is delivered
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 cursor-pointer to-blue-700 text-white font-medium py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <span className="drop-shadow-sm">Place Order</span>
            </button>
          </div>

          {/* Right Column - Order Summary (Desktop) */}
          <div className="hidden lg:block lg:w-1/3">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sticky top-4 border border-white/20 transition-all duration-300 hover:shadow-2xl animate-fade-in">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Buy Now Items */}
              {buyNowItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Your Purchase
                  </h3>
                  {buyNowItems.map((item, index) => (
                    <div
                      key={`buynow-${item.id}`}
                      className="flex items-start gap-4 border-b border-gray-100 pb-4 animate-fade-in"
                      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                    >
                      <div className="flex-shrink-0">
                        <div className="h-20 w-14 rounded-lg overflow-hidden shadow-sm border border-gray-100/50">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.title}
                        </h3>
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </span>
                          <div className="text-xs text-gray-400 mt-1">
                            Rs.{item.salePrice.toLocaleString()} ×{" "}
                            {item.quantity}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Rs.{(item.salePrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Cart Items */}
              {cart.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Your Cart Items
                  </h3>
                  {cart.map((item, index) => (
                    <div
                      key={`cart-${item.id}`}
                      className="flex items-start gap-4 border-b border-gray-100 pb-4 animate-fade-in"
                      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                    >
                      <div className="flex-shrink-0">
                        <div className="h-20 w-14 rounded-lg overflow-hidden shadow-sm border border-gray-100/50">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100/50 disabled:opacity-40 rounded-l-xl transition-all duration-200 hover:scale-110"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-4 py-1 text-center w-12 text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100/50 disabled:opacity-40 rounded-r-xl transition-all duration-200 hover:scale-110"
                              disabled={item.quantity >= 10}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-all duration-200 hover:bg-red-50/50 hover:scale-110"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Rs.{item.salePrice.toLocaleString()} × {item.quantity}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Rs.{(item.salePrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Order Totals */}
              <div className="border-t border-gray-200/50 pt-6 space-y-3 animate-fade-in">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">
                    Rs.{subtotal.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">
                    Rs.{shippingCost.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between border-t border-gray-200/50 pt-3">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-bold text-gray-900">
                    Rs.{total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal - Glass Morphism Effect */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 max-w-sm w-full mx-4 text-center border border-white/30 shadow-2xl transform transition-all duration-500 scale-90 animate-scale-in">
            <div className="flex justify-center mb-4 animate-bounce">
              <CheckCircle2 className="text-green-500 w-16 h-16 drop-shadow-lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-6 animate-fade-in">
              Thank you for your purchase. We'll contact you shortly to confirm
              your order.
            </p>
            <div className="animate-pulse mb-2">
              <div className="h-3 bg-blue-200/50 rounded-full w-full overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-progress"
                  style={{ animationDuration: "3s" }}
                ></div>
              </div>
            </div>
            <div className="text-xs text-gray-400 animate-fade-in">
              Redirecting to homepage...
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            forwards;
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out;
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
        .animate-delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
