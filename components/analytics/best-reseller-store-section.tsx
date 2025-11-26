"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimeFilter } from "../dashboard/time-filter-context";
import BestResellerStoreList from "./best-reseller-store-list";
import { useBestResellerStoresData } from "@/hooks/use-analytics-data";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function BestResellerStoreSection() {
  const { timeRange } = useTimeFilter();
  const {
    data: bestResellerStores,
    isLoading,
    error,
    refetch,
  } = useBestResellerStoresData(timeRange);

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Best Reseller Store</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
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
      <Card>
        <CardHeader>
          <CardTitle>Best Reseller Store</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p className="mb-3">Failed to load best reseller stores data.</p>
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
      <CardHeader>
        <CardTitle>Best Reseller Store</CardTitle>
      </CardHeader>
      <CardContent>
        {bestResellerStores && (
          <BestResellerStoreList stores={bestResellerStores} />
        )}
      </CardContent>
    </Card>
  );
}
