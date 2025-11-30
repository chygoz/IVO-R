"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { MonthlySalesChart } from "@/components/dashboard/monthly-sales-chart";
import { TopProductsList } from "@/components/dashboard/top-product-list";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "@/contexts/reseller-store-context";

export default function DashboardPage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const [isClient, setIsClient] = useState(false);
  const { store } = useStore();

  // Ensure hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 pb-24 md:pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold mb-1 capitalize">
          {store.name} Dashboard
        </h1>
        <p className="text-sm text-gray-600">
          Overview of your store&apos;s performance
        </p>
      </motion.div>

      <Suspense fallback={<DashboardStatsLoading />}>
        <DashboardStats storeId={storeId} />
      </Suspense>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Monthly Sales
              </CardTitle>
              <CardDescription className="text-xs">
                Revenue for the past 6 months
              </CardDescription>
            </div>
            <ArrowUpRight size={16} className="text-gray-400" />
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64">
              <Suspense
                fallback={
                  <div className="h-full w-full animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
                }
              >
                <MonthlySalesChart storeId={storeId} />
              </Suspense>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Top Products
              </CardTitle>
              <CardDescription className="text-xs">
                Best selling items
              </CardDescription>
            </div>
            <ArrowUpRight size={16} className="text-gray-400" />
          </CardHeader>
          <CardContent className="p-4">
            <Suspense
              fallback={
                <div className="h-48 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
              }
            >
              <TopProductsList storeId={storeId} />
            </Suspense>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="shadow-sm">
          <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Category Breakdown
              </CardTitle>
              <CardDescription className="text-xs">
                Sales by product category
              </CardDescription>
            </div>
            <ArrowUpRight size={16} className="text-gray-400" />
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-56">
              <Suspense
                fallback={
                  <div className="h-full w-full animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
                }
              >
                <CategoryBreakdown storeId={storeId} />
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function DashboardStatsLoading() {
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
