"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ConversionData } from "./types";

interface ConversionChartProps {
  data: ConversionData[];
}

export default function ConversionChart({ data }: ConversionChartProps) {
  const [chartData, setChartData] = useState<ConversionData[]>([]);

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

  // Format the values
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
          <p className="text-blue-500">{`Visits: ${payload[0].value}`}</p>
          <p className="text-green-500">{`Purchases: ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="h-[300px] w-full"
      variants={chartAnimation}
      initial="hidden"
      animate="visible"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 5, left: 5, bottom: 5 }}
          barSize={10}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={formatYAxis}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="visits" fill="#3b82f6" radius={[10, 10, 10, 10]} />
          <Bar dataKey="purchases" fill="#10b981" radius={[10, 10, 10, 10]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
