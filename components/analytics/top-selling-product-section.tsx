"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTopSellingProductsData } from "@/hooks/use-analytics-data";
import { useTimeFilter } from "../dashboard/time-filter-context";
import ProductDonutChart from "./product-donut-chart";
import ProductList from "./product-list";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function TopSellingProductSection() {
  const { timeRange } = useTimeFilter();
  const {
    data: topSellingProducts,
    isLoading,
    error,
    refetch,
  } = useTopSellingProductsData(timeRange);

  // Loading state
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Skeleton className="h-[180px] w-[180px] rounded-full" />
          <div className="w-full space-y-2 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Top Selling Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p className="mb-3">Failed to load top selling products data.</p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Success state
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Selling Product</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {topSellingProducts && (
          <>
            <ProductDonutChart
              products={topSellingProducts.products}
              total={topSellingProducts.total}
            />
            <ProductList products={topSellingProducts.products} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
