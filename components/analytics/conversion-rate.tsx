"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useConversionRateData } from "@/hooks/use-analytics-data";
import { useTimeFilter } from "../dashboard/time-filter-context";
import ConversionChart from "./conversion-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function ConversionRateSection() {
  const { timeRange } = useTimeFilter();
  const {
    data: conversionRate,
    isLoading,
    error,
    refetch,
  } = useConversionRateData(timeRange);

  // Loading state
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p className="mb-3">Failed to load conversion rate data.</p>
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Conversion Rate</CardTitle>
        <div className="text-2xl font-bold">{conversionRate?.value}</div>
      </CardHeader>
      <CardContent>
        {conversionRate && (
          <>
            <div className="flex justify-between items-center mb-4">
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                <span className="mr-1">Visits:</span> {conversionRate.visits}
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 hover:bg-green-200"
              >
                <span className="mr-1">Purchases:</span>{" "}
                {conversionRate.purchases}
              </Badge>
            </div>
            <ConversionChart data={conversionRate.data} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
