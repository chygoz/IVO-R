"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/contexts/reseller-store-context";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Layers } from "lucide-react";
import { apiClient } from "@/lib/api/api-client";

interface CategoryData {
  category: string;
  value: number;
  percentage: number;
}

export function CategoryBreakdown({ storeId }: { storeId: string }) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { store } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.seller.get(
          "/api/v1/analytics/dashboard"
        );
        const result = response;

        if (result.success && result.data && result.data.categoryBreakdown) {
          setCategories(result.data.categoryBreakdown);
        }
      } catch (error) {
        console.error("Failed to fetch category breakdown:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

  if (loading) {
    return (
      <div className="h-full w-full animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Layers className="h-10 w-10 text-gray-300" />
        <p className="mt-2 text-sm text-gray-500">No category data available</p>
        <p className="text-xs text-gray-400">
          Add products to categories to see this chart
        </p>
      </div>
    );
  }

  const { primaryColor, secondaryColor, accentColor } = store.storefront.theme;

  // Generate colors based on the theme
  const COLORS = [
    primaryColor || "#4f46e5",
    secondaryColor || "#10b981",
    accentColor || "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-md text-xs">
          <p className="font-medium">{payload[0].name}</p>
          <p>Sales: {payload[0].value}</p>
          <p>{payload[0].payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categories}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            dataKey="value"
            nameKey="category"
            animationDuration={1000}
          >
            {categories.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: "11px", paddingTop: "15px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
