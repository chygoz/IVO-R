"use client";

import { motion } from "framer-motion";
import { SalesByLocation } from "./types";

interface LocationListProps {
  locations: SalesByLocation[];
}

export default function LocationList({ locations }: LocationListProps) {
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="w-full space-y-2 mt-4"
      variants={containerAnimation}
      initial="hidden"
      animate="visible"
    >
      {locations.map((location, index) => (
        <motion.div
          key={index}
          className="flex items-center justify-between"
          variants={itemAnimation}
        >
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: location.color }}
            />
            <span className="text-sm">{location.name}</span>
          </div>
          <span className="text-sm font-medium">{location.percentage}%</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
