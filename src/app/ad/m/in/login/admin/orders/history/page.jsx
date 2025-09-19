"use client";

import AdminLayout from "@/components/Layout/AdminLayout";
import { getDeliveryHistory, getCancelHistory } from "@/utils/bookStorage";
import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";

const HistoryPage = () => {
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [cancelHistory, setCancelHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("delivered");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    setDeliveryHistory(getDeliveryHistory().slice(0, 10));
    setCancelHistory(getCancelHistory().slice(0, 10));
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 md:mt-0 mt-15">
        <h2 className="text-2xl font-bold text-gray-800">Orders History</h2>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === "delivered"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("delivered")}
          >
            <CheckCircle2 className="h-5 w-5" />
            Delivered ({deliveryHistory.length})
          </button>
          <button
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === "canceled"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("canceled")}
          >
            <XCircle className="h-5 w-5" />
            Canceled ({cancelHistory.length})
          </button>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {activeTab === "delivered" ? (
            deliveryHistory.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
                No delivery history found
              </div>
            ) : (
              deliveryHistory.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                    onClick={() => toggleExpandOrder(order.id)}
                  >
                    <div>
                      <h3 className="font-medium">
                        Order #{order.id} • {order.customerInfo?.firstName}{" "}
                        {order.customerInfo?.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Ordered on {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-green-600">
                        Delivered on {formatDate(order.actionDate)}
                      </span>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="p-4 border-t bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Customer
                          </h4>
                          <p className="font-medium">
                            {order.customerInfo?.firstName}{" "}
                            {order.customerInfo?.lastName}
                          </p>
                          {order.customerInfo?.phone && (
                            <p className="text-sm text-gray-600 mt-1">
                              +92 {order.customerInfo.phone}
                            </p>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Address
                          </h4>
                          <p className="text-sm">
                            {[
                              order.customerInfo?.address,
                              order.customerInfo?.city,
                              "Pakistan",
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Order Total
                        </h4>
                        <p className="text-xl font-bold">
                          Rs. {order.total?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )
          ) : cancelHistory.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
              No cancellation history found
            </div>
          ) : (
            cancelHistory.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                  onClick={() => toggleExpandOrder(order.id)}
                >
                  <div>
                    <h3 className="font-medium">
                      Order #{order.id} • {order.customerInfo?.firstName}{" "}
                      {order.customerInfo?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Ordered on {formatDate(order.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-red-600">
                      Canceled on {formatDate(order.actionDate)}
                    </span>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="p-4 border-t bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Customer
                        </h4>
                        <p className="font-medium">
                          {order.customerInfo?.firstName}{" "}
                          {order.customerInfo?.lastName}
                        </p>
                        {order.customerInfo?.phone && (
                          <p className="text-sm text-gray-600 mt-1">
                            +92 {order.customerInfo.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Reason
                        </h4>
                        <p className="text-sm">
                          {order.cancellationReason || "No reason provided"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Order Total
                      </h4>
                      <p className="text-xl font-bold">
                        Rs. {order.total?.toLocaleString() || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default HistoryPage;
