"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const BlankDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse mr-4" />
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Tabs Skeleton */}
            <div className="mb-6">
              <div className="flex space-x-4 mb-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-24 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                {/* Image Gallery Skeleton */}
                <div className="aspect-video bg-gray-200 rounded-lg animate-pulse mb-6" />

                {/* Color Selection Skeleton */}
                <div className="mb-6">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="flex gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 border rounded-lg"
                      >
                        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description Skeleton */}
                <div className="mb-6">
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                {/* Tags Skeleton */}
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-6 w-16 bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>

                {/* Sizes Skeleton */}
                <div>
                  <div className="h-6 w-28 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-6 w-8 bg-gray-200 rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Pricing Card Skeleton */}
          <Card className="shadow-sm">
            <CardHeader className="p-6">
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div>
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </CardFooter>
          </Card>

          {/* Features Card Skeleton */}
          <Card className="shadow-sm">
            <CardHeader className="p-6">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stock Info Skeleton */}
          <Card className="shadow-sm">
            <CardHeader className="p-6">
              <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlankDetailSkeleton;
