"use client";
import React from "react";
import { motion } from "framer-motion";
function Loading() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-8">
        <motion.div
          className="w-16 h-16 rounded-full border-t-2 border-b-2 border-primary"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}

export default Loading;
