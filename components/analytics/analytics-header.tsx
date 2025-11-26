"use client";
import { motion } from "framer-motion";
import { useTimeFilter } from "../dashboard/time-filter-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AnalyticsHeader() {
  const { timeRange, setTimeRange } = useTimeFilter();

  const fadeIn = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Analytics</h1>
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as any)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Date</SelectItem>
            <SelectItem value="12m">12 Months</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="24h">24 Hour</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}
