"use client";
import { motion } from "framer-motion";
import { TopSellingProduct } from "./types";

interface ProductListProps {
  products: TopSellingProduct[];
}

export default function ProductList({ products }: ProductListProps) {
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
      {products.map((product) => (
        <motion.div
          key={product.id}
          className="flex items-center justify-between"
          variants={itemAnimation}
        >
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: product.color }}
            />
            <span className="text-sm">{product.name}</span>
          </div>
          <span className="text-sm font-medium">{product.percentage}%</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
