import React from "react";
import {
  CircleCheck,
  CircleDashed,
  ShoppingBag,
  Package,
  Truck,
  X,
} from "lucide-react";

interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  // Define color and icon based on status
  const statusConfig: Record<
    string,
    { color: string; bgColor: string; icon: React.ReactNode }
  > = {
    created: {
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      icon: <CircleDashed className="h-4 w-4" />,
    },
    processing: {
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    packed: {
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      icon: <Package className="h-4 w-4" />,
    },
    shipped: {
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      icon: <Truck className="h-4 w-4" />,
    },
    delivered: {
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: <CircleCheck className="h-4 w-4" />,
    },
    cancelled: {
      color: "text-red-600",
      bgColor: "bg-red-100",
      icon: <X className="h-4 w-4" />,
    },
  };

  // Default to processing if status not found
  const { color, bgColor, icon } =
    statusConfig[status?.toLowerCase()] || statusConfig.processing;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${color}`}
    >
      {icon}
      <span className="ml-1 capitalize">{status}</span>
    </span>
  );
}
