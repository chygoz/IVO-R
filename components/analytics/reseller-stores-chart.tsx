"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ResellerStoreData } from "./types";

interface ResellerStoresChartProps {
  data: ResellerStoreData[];
}

export default function ResellerStoresChart({
  data,
}: ResellerStoresChartProps) {
  const [chartData, setChartData] = useState<ResellerStoreData[]>([]);

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
          <p className="text-primary">{`Existing Stores: ${payload[0].value}`}</p>
          <p className="text-orange-500">{`New Stores: ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <div className="flex justify-center gap-6 text-sm">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
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
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
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
          <Legend content={renderLegend} verticalAlign="bottom" height={36} />
          <Bar
            dataKey="existingStores"
            name="Reseller Stores"
            stackId="a"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="newStores"
            name="New Reseller Stores"
            stackId="a"
            fill="#f97316"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
