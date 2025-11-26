"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTotalOrdersData } from "@/hooks/use-analytics-data";
import { useTimeFilter } from "../dashboard/time-filter-context";
import OrdersLineChart from "./orders-line-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function TotalOrdersSection() {
  const { timeRange } = useTimeFilter();
  const {
    data: totalOrders,
    isLoading,
    error,
    refetch,
  } = useTotalOrdersData(timeRange);

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Total Order</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p className="mb-3">Failed to load orders data.</p>
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
        <CardTitle>Total Order</CardTitle>
        <div className="text-2xl font-bold">{totalOrders?.value}</div>
      </CardHeader>
      <CardContent>
        {totalOrders?.data && <OrdersLineChart data={totalOrders.data} />}
      </CardContent>
    </Card>
  );
}
