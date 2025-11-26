"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalesByLocationData } from "@/hooks/use-analytics-data";
import { useTimeFilter } from "../dashboard/time-filter-context";
import LocationDonutChart from "./location-donut-chart";
import LocationList from "./location-list";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function SalesByLocationSection() {
  const { timeRange } = useTimeFilter();
  const {
    data: salesByLocation,
    isLoading,
    error,
    refetch,
  } = useSalesByLocationData(timeRange);

  // Loading state
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Skeleton className="h-[180px] w-[180px] rounded-full" />
          <div className="w-full space-y-2 mt-4">
            {Array.from({ length: 2 }).map((_, i) => (
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
          <CardTitle>Sales by Location</CardTitle>
          <div className="text-sm text-muted-foreground">
            Sales performance by location
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p className="mb-3">Failed to load location data.</p>
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
        <CardTitle>Sales by Location</CardTitle>
        <div className="text-sm text-muted-foreground">
          Sales performance by location
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {salesByLocation && (
          <>
            <LocationDonutChart
              locations={salesByLocation.locations}
              total={salesByLocation.total}
            />
            <LocationList locations={salesByLocation.locations} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
