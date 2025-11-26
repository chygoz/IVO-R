"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store-context";
import { Loader2, Package, CreditCard, Truck } from "lucide-react";

interface CheckoutLoadingProps {
  stage: "creating" | "processing" | "shipping";
  message?: string;
}

export function CheckoutLoading({ stage, message }: CheckoutLoadingProps) {
  const { store } = useStore();
  const { colors } = store;

  const getStageInfo = () => {
    switch (stage) {
      case "creating":
        return {
          icon: Package,
          title: "Creating Your Order",
          description: "Setting up your order details...",
        };
      case "processing":
        return {
          icon: CreditCard,
          title: "Processing Payment",
          description: "Securely processing your payment...",
        };
      case "shipping":
        return {
          icon: Truck,
          title: "Calculating Shipping",
          description: "Finding the best shipping options...",
        };
      default:
        return {
          icon: Loader2,
          title: "Loading",
          description: "Please wait...",
        };
    }
  };

  const stageInfo = getStageInfo();
  const Icon = stageInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-6"
      >
        <Icon className="w-12 h-12" style={{ color: colors.primary }} />
      </motion.div>

      <motion.h3
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold mb-2"
        style={{ color: colors.primary }}
      >
        {stageInfo.title}
      </motion.h3>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 text-center"
      >
        {message || stageInfo.description}
      </motion.p>

      <motion.div
        className="flex space-x-1 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.primary }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
