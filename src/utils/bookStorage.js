// src/utils/bookStorage.js
import { bookData, initialOrders } from "@/data/bookData";

// Initialize data
const initializeData = () => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem("manualBooks")) {
    localStorage.setItem("manualBooks", JSON.stringify([]));
  }

  if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify([]));
  }

  // Initialize history storage if not exists
  if (!localStorage.getItem("deliveryHistory")) {
    localStorage.setItem("deliveryHistory", JSON.stringify([]));
  }

  if (!localStorage.getItem("cancelHistory")) {
    localStorage.setItem("cancelHistory", JSON.stringify([]));
  }
};

if (typeof window !== "undefined") {
  initializeData();
}

// Manual Books Functions
export const getManualBooks = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("manualBooks") || "[]");
};

export const saveManualBooks = (books) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("manualBooks", JSON.stringify(books));
};

// Combined Books (static + manual)
export const getBooks = () => {
  const staticBooks = bookData;
  if (typeof window === "undefined") return staticBooks;
  return [...staticBooks, ...getManualBooks()];
};

// Helper function for order ID generation
const generateOrderId = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0"); // DD
  const month = String(now.getMonth() + 1).padStart(2, "0"); // MM
  const year = now.getFullYear(); // YYYY

  // Get today's orders count for sequence number
  const todayOrders = getOrders().filter((order) => {
    const orderDate = new Date(order.date);
    return (
      orderDate.getDate() === now.getDate() &&
      orderDate.getMonth() === now.getMonth() &&
      orderDate.getFullYear() === now.getFullYear()
    );
  });

  // Sequence number (no padding, can be 1, 2, ..., 1000, etc.)
  const sequence = todayOrders.length + 1;

  // Format: DDMMYYYYNNNN (no padding for sequence)
  return `${day}${month}${year}${sequence}`;
};

// Orders Functions
export const getOrders = () => {
  if (typeof window === "undefined") return [];

  const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");

  // Return sample orders ONLY if no real orders exist
  return savedOrders.length === 0 ? initialOrders : savedOrders;
};

export const saveOrders = (orderData) => {
  if (typeof window === "undefined") return;

  const orders = getOrders();
  const newOrder = {
    ...orderData,
    id: generateOrderId(), // Auto-generate new format ID
    date: new Date().toISOString(),
  };

  // Only update localStorage if working with real orders
  if (orders !== initialOrders) {
    localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));
  }
  return [...orders, newOrder];
};

export const updateOrderStatus = (orderId, status) => {
  if (typeof window === "undefined") return;

  const orders = getOrders();
  const updatedOrders = orders.map((order) =>
    order.id === orderId ? { ...order, status } : order
  );

  // Only update localStorage if working with real orders
  if (orders !== initialOrders) {
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  }
  return updatedOrders;
};

export const cancelOrder = (orderId) => {
  if (typeof window === "undefined") return;

  const orders = getOrders();
  const updatedOrders = orders.filter((order) => order.id !== orderId);

  // Only update localStorage if working with real orders
  if (orders !== initialOrders) {
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  }
  return updatedOrders;
};

// Order History Functions
export const addToDeliveryHistory = (order) => {
  if (typeof window === "undefined") return;

  const history = JSON.parse(localStorage.getItem("deliveryHistory") || "[]");
  history.push({
    ...order,
    action: "delivered",
    actionDate: new Date().toISOString(),
  });
  localStorage.setItem("deliveryHistory", JSON.stringify(history));

  // Keep only last 10 delivered orders
  if (history.length > 10) {
    localStorage.setItem("deliveryHistory", JSON.stringify(history.slice(-10)));
  }
};

export const addToCancelHistory = (order) => {
  if (typeof window === "undefined") return;

  const history = JSON.parse(localStorage.getItem("cancelHistory") || "[]");
  history.push({
    ...order,
    action: "canceled",
    actionDate: new Date().toISOString(),
  });
  localStorage.setItem("cancelHistory", JSON.stringify(history));

  // Keep only last 10 canceled orders
  if (history.length > 10) {
    localStorage.setItem("cancelHistory", JSON.stringify(history.slice(-10)));
  }
};

export const getDeliveryHistory = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("deliveryHistory") || "[]");
};

export const getCancelHistory = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cancelHistory") || "[]");
};

// Statistics (works with combined data)
export const getStats = () => {
  const books = getBooks();
  const orders = getOrders();

  return {
    totalBooks: books.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    outOfStock: books.filter((book) => book.stock <= 0).length,
    totalCategories: [...new Set(books.map((book) => book.category))].length,
  };
};

export const getBookDetails = (id) => {
  const staticBooks = bookData;
  const manualBooks = getManualBooks();
  const allBooks = [...staticBooks, ...manualBooks];

  const book = allBooks.find((b) => b.id === id);
  return {
    title: book?.title || "Unknown Book",
    image: book?.image || "",
    price: book?.salePrice || 0,
  };
};
