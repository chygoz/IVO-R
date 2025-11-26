"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/reseller-store-context";

// Mock data for recent orders
const MOCK_ORDERS = [
  {
    id: "ORD-1234",
    customer: "John Doe",
    amount: "$120.00",
    status: "completed",
    date: "2025-05-18",
  },
  {
    id: "ORD-1235",
    customer: "Jane Smith",
    amount: "$75.50",
    status: "processing",
    date: "2025-05-17",
  },
  {
    id: "ORD-1236",
    customer: "Mike Johnson",
    amount: "$49.99",
    status: "completed",
    date: "2025-05-16",
  },
];

export function RecentOrders({ storeId }: { storeId: string }) {
  const [loading, setLoading] = useState(true);
  const { store } = useStore();

  // In a real app, you would fetch orders data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-md"
          />
        ))}
      </div>
    );

  const { primaryColor } = store.storefront.theme;
  const themeColor = primaryColor || "#4f46e5";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {MOCK_ORDERS.length > 0 ? (
        <>
          <div className="space-y-3">
            {MOCK_ORDERS.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-md border hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="rounded-full p-2"
                    style={{ backgroundColor: `${themeColor}20` }}
                  >
                    <ShoppingBag size={16} style={{ color: themeColor }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.amount}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full">
            View all orders
            <ArrowRight size={14} className="ml-2" />
          </Button>
        </>
      ) : (
        <div className="text-center py-8">
          <ShoppingBag className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No orders yet</p>
        </div>
      )}
    </div>
  );
}
