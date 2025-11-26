"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package2 } from "lucide-react";

export function ProductsTabSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 h-48 bg-gray-100 relative flex items-center justify-center">
                    <Package2 className="h-12 w-12 text-gray-300" />
                    <div className="absolute top-2 right-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>

                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Skeleton className="h-6 w-40 mb-1" />
                        <Skeleton className="h-4 w-28" />
                      </div>

                      <Skeleton className="h-9 w-20 rounded-md" />
                    </div>

                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4 mt-1" />

                    <div className="mt-4">
                      <Skeleton className="h-5 w-24 mb-2" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-8 w-36 rounded-md" />
                        <Skeleton className="h-8 w-40 rounded-md" />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <Skeleton className="h-5 w-32" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
