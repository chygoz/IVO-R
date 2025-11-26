"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, ShoppingBag, DollarSign, Users2 } from "lucide-react";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";
import { useStore } from "@/contexts/reseller-store-context";
import { apiClient } from "@/lib/api/api-client";

interface DashboardStats {
  customers: StatsItem;
  orders: StatsItem;
  sales: StatsItem & { currency: string };
  resellers: StatsItem;
}

interface StatsItem {
  current: number;
  previous: number;
  trend: string;
  trendDirection: "up" | "down" | "stable";
}

export function DashboardStats({ storeId }: { storeId: string }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { store } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.seller.get(
          "/api/v1/analytics/dashboard"
        );
        const result = await response;

        if (result.success && result.data) {
          const { customers, orders, sales, resellers } = result.data;
          setStats({ customers, orders, sales, resellers });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const { primaryColor } = store.storefront.theme;
  const themeColor = primaryColor || "#4f46e5";

  const statItems = [
    {
      title: "Customers",
      value: stats.customers.current,
      previous: stats.customers.previous,
      trend: stats.customers.trend,
      direction: stats.customers.trendDirection,
      icon: Users,
    },
    {
      title: "Orders",
      value: stats.orders.current,
      previous: stats.orders.previous,
      trend: stats.orders.trend,
      direction: stats.orders.trendDirection,
      icon: ShoppingBag,
    },
    {
      title: "Sales",
      value: stats.sales.current,
      previous: stats.sales.previous,
      trend: stats.sales.trend,
      direction: stats.sales.trendDirection,
      icon: DollarSign,
      prefix: "NGN",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div
                  className="rounded-full p-2"
                  style={{ backgroundColor: `${themeColor}15` }}
                >
                  <item.icon size={16} style={{ color: themeColor }} />
                </div>
                <div
                  className={`flex items-center text-xs font-medium ${
                    item.direction === "up"
                      ? "text-green-600"
                      : item.direction === "down"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {item.direction === "up" ? (
                    <ArrowUpIcon size={12} />
                  ) : item.direction === "down" ? (
                    <ArrowDownIcon size={12} />
                  ) : (
                    <ArrowRightIcon size={12} />
                  )}
                  <span>{item.trend}%</span>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-500">
                  {item.title}
                </p>
                <p className="text-xl font-bold mt-1">
                  {item.prefix ? `${item.prefix} ` : ""}
                  {item.value.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
