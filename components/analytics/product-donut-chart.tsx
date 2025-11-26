"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TopSellingProduct } from "./types";

interface ProductDonutChartProps {
  products: TopSellingProduct[];
  total: string;
}

export default function ProductDonutChart({
  products,
  total,
}: ProductDonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [chartData, setChartData] = useState<TopSellingProduct[]>([]);

  // Format data for the pie chart
  const data = products.map((product) => ({
    ...product,
    value: product.percentage,
  }));

  // Animate the chart data on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartData(data);
    }, 500);

    return () => clearTimeout(timer);
  }, [data]);

  const chartAnimation = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="w-full flex items-center justify-center h-[180px] relative"
      variants={chartAnimation}
      initial="hidden"
      animate="visible"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                strokeWidth={activeIndex === index ? 2 : 0}
                className="transition-all duration-300"
                stroke="#fff"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-2xl font-bold">{total}</span>
      </div>
    </motion.div>
  );
}
