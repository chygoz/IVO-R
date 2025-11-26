"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store-context";
import { Check, Circle } from "lucide-react";

interface CheckoutProgressProps {
  currentStep: "shipping" | "payment" | "confirmation";
  completedSteps: string[];
}

export function CheckoutProgress({
  currentStep,
  completedSteps,
}: CheckoutProgressProps) {
  const { store } = useStore();
  const { colors } = store;

  const steps = [
    { key: "shipping", label: "Shipping", number: 1 },
    { key: "payment", label: "Payment", number: 2 },
    { key: "confirmation", label: "Confirmation", number: 3 },
  ];

  const getStepStatus = (stepKey: string) => {
    if (completedSteps.includes(stepKey)) return "completed";
    if (stepKey === currentStep) return "current";
    return "pending";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />

        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.key} className="flex items-center z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                {/* Step Circle */}
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    status === "completed" || status === "current"
                      ? "border-transparent shadow-lg"
                      : "border-gray-300 bg-white"
                  }`}
                  style={
                    status === "completed" || status === "current"
                      ? { backgroundColor: colors.primary }
                      : {}
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {status === "completed" ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : status === "current" ? (
                    <Circle className="w-5 h-5 text-white fill-current" />
                  ) : (
                    <span
                      className="text-sm font-semibold"
                      style={{ color: colors.text }}
                    >
                      {step.number}
                    </span>
                  )}
                </motion.div>

                {/* Step Label */}
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className={`mt-2 text-xs font-medium ${
                    status === "current" ? "text-current" : "text-gray-500"
                  }`}
                  style={status === "current" ? { color: colors.primary } : {}}
                >
                  {step.label}
                </motion.span>
              </motion.div>

              {/* Progress Line Segment */}
              {!isLast && (
                <motion.div
                  className="h-0.5 bg-gray-200 mx-4 flex-1"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: completedSteps.includes(step.key) ? 1 : 0,
                    backgroundColor: completedSteps.includes(step.key)
                      ? colors.primary
                      : "#e5e7eb",
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
