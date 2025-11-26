"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoriesData } from "@/hooks/use-analytics-data";
import { useTimeFilter } from "../dashboard/time-filter-context";
import CategoryProgress from "../dashboard/category-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function CategoriesSection() {
  const { timeRange } = useTimeFilter();
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useCategoriesData(timeRange);

  // Loading state
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Most Sold Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p className="mb-3">Failed to load categories data.</p>
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
        <CardTitle>Most Sold Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories &&
          categories.map((category, index) => (
            <CategoryProgress
              key={category.name}
              category={category}
              index={index}
            />
          ))}
      </CardContent>
    </Card>
  );
}
