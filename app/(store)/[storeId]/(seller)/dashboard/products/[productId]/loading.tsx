"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Skeleton = ({ className }: { className: string }) => (
  <motion.div
    className={`bg-gray-200 rounded-md ${className}`}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  />
);

const SkeletonLine = ({ width = "w-full" }: { width?: string }) => (
  <Skeleton className={`h-4 ${width}`} />
);

const SkeletonCircle = ({ size = "h-6 w-6" }: { size?: string }) => (
  <Skeleton className={`${size} rounded-full`} />
);

export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Mobile Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div className="flex items-start">
          <Skeleton className="h-8 w-8 mr-2 mt-1 flex-shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-8 w-3/4 sm:w-80" />
            <Skeleton className="h-4 w-1/2 sm:w-40" />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Skeleton className="h-9 w-24 sm:w-32" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Tabs Skeleton */}
          <div className="mb-6">
            <div className="grid grid-cols-4 gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>

            {/* Tab Content Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Product Image Section */}
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-md relative overflow-hidden">
                    <Skeleton className="w-full h-full" />
                    <div className="absolute top-3 right-3">
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>

                  {/* Gallery Thumbnails */}
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-square" />
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Product Details Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-4">
                    {/* Description */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <div className="space-y-1">
                        <SkeletonLine />
                        <SkeletonLine width="w-3/4" />
                        <SkeletonLine width="w-1/2" />
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>

                    {/* Base Price */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="h-6 w-16" />
                        ))}
                      </div>
                    </div>

                    {/* Available Colors */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <div className="flex gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <SkeletonCircle key={i} />
                        ))}
                      </div>
                    </div>

                    {/* Available Sizes */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Skeleton key={i} className="h-6 w-12" />
                        ))}
                      </div>
                    </div>

                    {/* Stock Level */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-28" />
                    </div>

                    {/* Created Date */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-4">
          {/* Status Card */}
          <Card>
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-12" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center mb-4">
                <SkeletonCircle size="h-5 w-5" />
                <div className="ml-2 space-y-1 flex-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          {/* Inventory Card */}
          <Card>
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-20" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>

                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <SkeletonCircle size="h-3 w-3" />
                        <Skeleton className="h-4 w-16 ml-2" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>

                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Optimized Skeleton Variants */}
      <div className="block sm:hidden mt-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center">
                    <SkeletonCircle size="h-4 w-4" />
                    <Skeleton className="h-4 w-20 ml-2" />
                    <Skeleton className="h-4 w-16 ml-1" />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div
                        key={j}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Skeleton for Mobile */}
      <div className="block sm:hidden mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SkeletonCircle size="h-5 w-5" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="p-3">
                    <div className="flex items-center gap-2">
                      <SkeletonCircle size="h-4 w-4" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <Skeleton className="h-8 w-12 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Skeleton className="h-5 w-36" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-gray-200"
                  >
                    <Skeleton className="h-4 w-16" />
                    <div className="flex items-center">
                      <SkeletonCircle size="h-3 w-3" />
                      <Skeleton className="h-4 w-12 ml-2" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
