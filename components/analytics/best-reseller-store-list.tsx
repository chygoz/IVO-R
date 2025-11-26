"use client";

import { motion } from "framer-motion";
import { BestResellerStore } from "./types";

interface BestResellerStoreListProps {
  stores: BestResellerStore[];
}

export default function BestResellerStoreList({
  stores,
}: BestResellerStoreListProps) {
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get the progress percentage for the progress bar
  const getProgressPercentage = (revenue: number) => {
    const maxRevenue = stores[0].revenue; // Assuming stores are sorted by revenue
    return (revenue / maxRevenue) * 100;
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerAnimation}
      initial="hidden"
      animate="visible"
    >
      {stores.map((store) => (
        <motion.div
          key={store.id}
          className="space-y-2"
          variants={itemAnimation}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{store.name}</span>
            <span className="text-sm">{formatCurrency(store.revenue)}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 dark:bg-gray-700">
            <motion.div
              className="bg-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage(store.revenue)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
