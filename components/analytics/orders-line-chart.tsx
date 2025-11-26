"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { OrderData } from "./types";

interface OrdersLineChartProps {
  data: OrderData[];
}

export default function OrdersLineChart({ data }: OrdersLineChartProps) {
  const [chartData, setChartData] = useState<OrderData[]>([]);

  // Animate the chart data on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartData(data);
    }, 500);

    return () => clearTimeout(timer);
  }, [data]);

  const chartAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  // Format the orders value
  const formatYAxis = (value: number) => {
    if (value === 0) return "0";
    if (value < 20) return "20k";
    if (value < 40) return "40k";
    if (value < 60) return "60k";
    if (value < 80) return "80k";
    return "100k";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-green-500">{`Orders: ${payload[0].value}K`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="h-[200px] w-full"
      variants={chartAnimation}
      initial="hidden"
      animate="visible"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={formatYAxis}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
