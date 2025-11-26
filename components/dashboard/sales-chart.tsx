"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useStore } from "@/contexts/reseller-store-context";
import { apiClient } from "@/lib/api/api-client";

interface MonthlySales {
  month: string;
  sales: number;
  reseller: number;
}

export function MonthlySalesChart({ storeId }: { storeId: string }) {
  const [data, setData] = useState<MonthlySales[]>([]);
  const [loading, setLoading] = useState(true);
  const { store } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.seller.get(
          "/api/v1/analytics/dashboard"
        );
        const result = response;

        if (result.success && result.data && result.data.monthlySales) {
          setData(result.data.monthlySales);
        }
      } catch (error) {
        console.error("Failed to fetch monthly sales data:", error);
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

  if (!data.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 text-sm">No sales data available</p>
      </div>
    );
  }

  const { primaryColor, accentColor } = store.storefront.theme;
  const salesColor = primaryColor || "#4f46e5";
  const resellerColor = accentColor || "#10b981";

  // Use last 6 months for mobile view
  const recentData = data.slice(-6);

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-md text-xs">
          <p className="font-medium">{label}</p>
          <p style={{ color: salesColor }}>
            Sales: {payload[0].value.toLocaleString()}
          </p>
          <p style={{ color: resellerColor }}>
            Reseller: {payload[1].value.toLocaleString()}
          </p>
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
        <BarChart
          data={recentData}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} />
          <YAxis
            //@ts-expect-error
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
            iconSize={8}
            iconType="circle"
          />
          <Bar
            dataKey="sales"
            name="Sales"
            fill={salesColor}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            barSize={window.innerWidth < 768 ? 12 : 20}
          />
          <Bar
            dataKey="reseller"
            name="Reseller"
            fill={resellerColor}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            //@ts-expect-error
            animationDelay={300}
            barSize={window.innerWidth < 768 ? 12 : 20}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
