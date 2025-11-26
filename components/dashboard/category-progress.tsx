"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { CategoryData } from "./types";

interface CategoryProgressProps {
  category: CategoryData;
  index: number;
}

export default function CategoryProgress({
  category,
  index,
}: CategoryProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(category.percentage);
    }, 300 + index * 100);

    return () => clearTimeout(timer);
  }, [category.percentage, index]);

  const itemAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      className="space-y-2"
      variants={itemAnimation}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between text-sm">
        <span>{category.name}</span>
        <span className="font-medium">{category.percentage}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </motion.div>
  );
}
