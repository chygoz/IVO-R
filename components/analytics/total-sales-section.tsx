"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimeFilter } from "../dashboard/time-filter-context";
import SalesBarChart from "./sales-bar-chart";
import { useTotalSalesData } from "@/hooks/use-analytics-data";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function TotalSalesSection() {
  const { timeRange } = useTimeFilter();
  const {
    data: totalSales,
    isLoading,
    error,
    refetch,
  } = useTotalSalesData(timeRange);

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p className="mb-3">Failed to load sales data.</p>
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Total Sales</CardTitle>
        <div className="text-2xl font-bold">{totalSales?.value}</div>
      </CardHeader>
      <CardContent>
        {totalSales?.data && <SalesBarChart data={totalSales.data} />}
      </CardContent>
    </Card>
  );
}
