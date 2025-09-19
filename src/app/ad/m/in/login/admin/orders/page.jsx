"use client";

import AdminLayout from "@/components/Layout/AdminLayout";
import {
  getOrders,
  getBooks,
  updateOrderStatus,
  cancelOrder,
  addToDeliveryHistory,
  addToCancelHistory,
} from "@/utils/bookStorage";
import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Truck,
  Clock,
  AlertCircle,
} from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    setIsClient(true);
    setOrders(getOrders());
    setBooks(getBooks());
  }, []);

  const getBookDetails = (id) => {
    const book = books.find((b) => b.id === id);
    return {
      title: book?.title || "Unknown Book",
      image: book?.image || "/placeholder-book.jpg",
      price: book?.salePrice || 0,
    };
  };

  const handleDeliver = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    const updatedOrders = updateOrderStatus(orderId, "Delivered");
    setOrders(updatedOrders);
    addToDeliveryHistory(order);
  };

  const handleCancel = (orderId) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      const order = orders.find((o) => o.id === orderId);
      const updatedOrders = cancelOrder(orderId);
      setOrders(updatedOrders);
      addToCancelHistory(order);
    }
  };

  const formatOrderId = (id) => {
    return id.toString().replace(/(\d{4})(\d{4})/, "$1-$2");
  };

  if (!isClient) {
    return (
      <AdminLayout>
        <div className="p-4 grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border border-gray-200 animate-pulse h-40"
            />
          ))}
        </div>
      </AdminLayout>
    );
  }

  const activeOrders = orders
    .filter(
      (order) => order.status !== "Delivered" && order.status !== "Cancelled"
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <AdminLayout>
      <div className="space-y-6 md:mt-0 mt-15">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Active Orders</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Truck className="h-4 w-4 text-blue-500" />
            {activeOrders.length} orders in progress
          </div>
        </div>

        {activeOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No active orders
            </h3>
            <p className="mt-1 text-gray-500">New orders will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const isSample = order.id.toString().startsWith("sample");

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden border ${
                    isSample
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-gray-200"
                  }`}
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-start"
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order.id)
                    }
                  >
                    <div className="flex items-start gap-4">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 mt-1" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 mt-1" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            Order #{formatOrderId(order.id)}
                          </h3>
                          {isSample && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Sample
                            </span>
                          )}
                        </div>
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-gray-600">
                            {order.customerInfo?.firstName}{" "}
                            {order.customerInfo?.lastName}
                            {order.customerInfo?.phone && (
                              <span className="ml-2">
                                • +92 {order.customerInfo.phone}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        <Clock className="h-3 w-3" />
                        Processing
                      </span>
                      <span className="text-sm font-medium">
                        Rs. {order.total?.toLocaleString() || "N/A"}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t divide-y">
                      {/* Order Items */}
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          {order.items.length} Item
                          {order.items.length > 1 ? "s" : ""}
                        </h4>
                        <div className="space-y-4">
                          {order.items.map((item) => {
                            const { title, image, price } = getBookDetails(
                              item.bookId
                            );
                            return (
                              <div
                                key={`${order.id}-${item.bookId}`}
                                className="flex items-start gap-4"
                              >
                                <div className="flex-shrink-0">
                                  <img
                                    src={image}
                                    alt={title}
                                    className="h-16 w-12 object-cover rounded-lg border"
                                    onError={(e) => {
                                      e.target.src = "/placeholder-book.jpg";
                                    }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-sm font-medium text-gray-900">
                                    {title}
                                  </h5>
                                  <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900">
                                    Rs.
                                    {(
                                      item.price || price * item.quantity
                                    ).toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Rs.{(item.price || price).toLocaleString()}{" "}
                                    each
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="p-4 bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Customer Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Full Name</p>
                            <p className="font-medium">
                              {order.customerInfo?.firstName}{" "}
                              {order.customerInfo?.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Contact</p>
                            <p className="font-medium">
                              {order.customerInfo?.phone
                                ? `+92 ${order.customerInfo.phone}`
                                : "Not provided"}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-500">Address</p>
                            <p className="font-medium">
                              {[
                                order.customerInfo?.address,
                                order.customerInfo?.apartment,
                                order.customerInfo?.city,
                                "Pakistan",
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-600">Subtotal</p>
                            <p className="text-sm font-medium">
                              Rs.{" "}
                              {order.subtotal?.toLocaleString() ||
                                order.items
                                  .reduce(
                                    (sum, item) =>
                                      sum +
                                      (item.price ||
                                        getBookDetails(item.bookId).price *
                                          item.quantity),
                                    0
                                  )
                                  .toLocaleString()}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-600">Shipping</p>
                            <p className="text-sm font-medium">
                              Rs.{order.shippingCost?.toLocaleString() || "250"}
                            </p>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-gray-200">
                            <p className="font-medium">Total</p>
                            <p className="font-bold">
                              Rs.{" "}
                              {(
                                order.total ||
                                (order.subtotal ||
                                  order.items.reduce(
                                    (sum, item) =>
                                      sum +
                                      (item.price ||
                                        getBookDetails(item.bookId).price *
                                          item.quantity),
                                    0
                                  )) + (order.shippingCost || 250)
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleDeliver(order.id)}
                            className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200 transition-colors"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Mark Delivered
                          </button>
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm hover:bg-red-200 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancel Order
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
