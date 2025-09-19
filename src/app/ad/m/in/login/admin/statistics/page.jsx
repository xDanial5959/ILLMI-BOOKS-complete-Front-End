"use client";

import AdminLayout from "@/components/Layout/AdminLayout";
import StatsCards from "@/components/StatsCards";

const StatisticsPage = () => {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold md:mt-0 mt-15 text-gray-800 mb-6">
        Statistics Dashboard
      </h2>
      <StatsCards />
    </AdminLayout>
  );
};

export default StatisticsPage;
