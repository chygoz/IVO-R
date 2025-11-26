"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store-context";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutHeaderProps {
  onBack: () => void;
  step: "shipping" | "payment" | "processing";
  itemCount: number;
}

export function CheckoutHeader({
  onBack,
  step,
  itemCount,
}: CheckoutHeaderProps) {
  const { store } = useStore();
  const { colors } = store;

  const getStepTitle = () => {
    switch (step) {
      case "shipping":
        return "Shipping Details";
      case "payment":
        return "Payment";
      case "processing":
        return "Processing";
      default:
        return "Checkout";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 lg:hidden"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <h1 className="font-semibold" style={{ color: colors.text }}>
              {getStepTitle()}
            </h1>
            <p className="text-xs text-gray-500">
              {step === "shipping"
                ? "Enter your details"
                : step === "payment"
                ? "Complete your order"
                : "Please wait..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" style={{ color: colors.primary }} />
          <span
            className="text-sm font-medium"
            style={{ color: colors.primary }}
          >
            {itemCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
