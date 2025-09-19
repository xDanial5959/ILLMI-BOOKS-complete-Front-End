"use client";

import { getStats, getOrders } from "@/utils/bookStorage";
import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, BarChart2, Loader } from "lucide-react";
import { Chart } from "chart.js/auto";

const StatsCards = () => {
  const [timePeriod, setTimePeriod] = useState("28");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Load data on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const statsData = getStats();
        const ordersData = getOrders();
        setStats(statsData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, []);

  // Update chart when data or time period changes
  useEffect(() => {
    if (!stats || !orders.length || !chartRef.current) return;

    const now = new Date();
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.date);
      const diffTime = now - orderDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return timePeriod === "24"
        ? diffTime <= 1000 * 60 * 60 * 24
        : diffDays <= parseInt(timePeriod);
    });

    // Calculate total revenue
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    // Prepare chart data
    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart if exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: generateChartLabels(parseInt(timePeriod)),
        datasets: [
          {
            label: "Revenue (Rs)",
            data: generateChartData(parseInt(timePeriod), filteredOrders),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.05)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => "Rs. " + value.toLocaleString(),
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [stats, orders, timePeriod]);

  const generateChartLabels = (period) => {
    return Array.from({ length: period }, (_, i) =>
      timePeriod === "24" ? `${i}:00` : `Day ${i + 1}`
    );
  };

  const generateChartData = (period, orders) => {
    return Array.from({ length: period }, (_, i) => {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      return orders
        .filter((order) => {
          const orderDate = new Date(order.date);
          return orderDate >= dayStart && orderDate < dayEnd;
        })
        .reduce((sum, order) => sum + (order.total || 0), 0);
    }).reverse();
  };

  if (!stats) {
    return (
      <div className="flex justify-center  items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading stats...</span>
      </div>
    );
  }

  const filteredRevenue = orders
    .filter((order) => {
      const orderDate = new Date(order.date);
      const diffDays = (new Date() - orderDate) / (1000 * 60 * 60 * 24);
      return timePeriod === "24"
        ? new Date() - orderDate <= 1000 * 60 * 60 * 24
        : diffDays <= parseInt(timePeriod);
    })
    .reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div className="space-y-6 ">
      {/* Time Period Selector */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="flex items-center gap-2 text-gray-700 font-medium">
            <BarChart2 className="h-5 w-5 text-blue-500" />
            Revenue Period
          </h3>
          <div className="flex flex-wrap gap-2">
            {["24h", "7d", "14d", "28d"].map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period.replace(/[^0-9]/g, ""))}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm ${
                  timePeriod === period.replace(/[^0-9]/g, "")
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {period.includes("h") ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <Calendar className="h-4 w-4" />
                )}
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Books</h3>
          <p className="text-2xl font-semibold mt-1">{stats.totalBooks}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-semibold mt-1">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">
            Revenue ({timePeriod === "24" ? "24h" : `${timePeriod}d`})
          </h3>
          <p className="text-2xl font-semibold mt-1">
            Rs. {filteredRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
          <p className="text-2xl font-semibold mt-1">{stats.outOfStock}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="h-64">
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
