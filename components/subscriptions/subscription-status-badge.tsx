import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

type SubscriptionStatus =
  | "active"
  | "expired"
  | "pending"
  | "cancelled"
  | "inactive";

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus;
}

export const SubscriptionStatusBadge: React.FC<
  SubscriptionStatusBadgeProps
> = ({ status }) => {
  const getStatusConfig = (status: SubscriptionStatus) => {
    switch (status) {
      case "active":
        return {
          icon: <CheckCircle className="w-3.5 h-3.5 mr-1" />,
          color:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          label: "Active",
        };
      case "expired":
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 mr-1" />,
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          label: "Expired",
        };
      case "pending":
        return {
          icon: <Clock className="w-3.5 h-3.5 mr-1" />,
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
          label: "Pending",
        };
      case "cancelled":
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 mr-1" />,
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
          label: "Cancelled",
        };
      case "inactive":
      default:
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 mr-1" />,
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
          label: "Inactive",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <Badge
        variant="outline"
        className={`flex items-center px-2.5 py-0.5 text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {config.label}
      </Badge>
    </motion.div>
  );
};
