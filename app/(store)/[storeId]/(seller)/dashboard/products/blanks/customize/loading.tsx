"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { motion } from "framer-motion";

export default function BlankCustomizeLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse mr-4" />
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="text-right">
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Skeleton */}
        <div className="md:col-span-1 space-y-4">
          {/* Selected Blanks Card Skeleton */}
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded animate-pulse mr-3" />
                      <div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
            </CardFooter>
          </Card>

          {/* Progress Card Skeleton */}
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="md:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-sm">
              <CardHeader className="p-6 pb-0">
                {/* Title and Badge Skeleton */}
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Tabs Skeleton */}
                <div className="mt-4">
                  <div className="grid grid-cols-4 gap-2 p-1 bg-gray-100 rounded-lg">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 bg-gray-200 rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Form Content Skeleton */}
                <div className="space-y-6">
                  {/* Input Field Skeletons */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-64 bg-gray-200 rounded animate-pulse" />
                    </div>

                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-72 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>

                  {/* Info Box Skeleton */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex">
                      <div className="h-5 w-5 bg-blue-200 rounded animate-pulse flex-shrink-0" />
                      <div className="ml-3 flex-1">
                        <div className="h-4 w-48 bg-blue-200 rounded animate-pulse mb-2" />
                        <div className="space-y-1">
                          <div className="h-3 w-32 bg-blue-200 rounded animate-pulse" />
                          <div className="h-3 w-full bg-blue-200 rounded animate-pulse" />
                          <div className="h-3 w-3/4 bg-blue-200 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Content Skeleton (conditional based on tab) */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>

                    {/* Pricing Breakdown Skeleton */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center"
                          >
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendation Box Skeleton */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="h-4 w-40 bg-blue-200 rounded animate-pulse mb-2" />
                      <div className="space-y-1">
                        <div className="h-3 w-56 bg-blue-200 rounded animate-pulse" />
                        <div className="h-3 w-64 bg-blue-200 rounded animate-pulse" />
                      </div>
                      <div className="h-8 w-40 bg-blue-200 rounded animate-pulse mt-2" />
                    </div>
                  </div>

                  {/* Variants Content Skeleton */}
                  <div className="space-y-6">
                    <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />

                    {[1, 2].map((colorIndex) => (
                      <motion.div
                        key={colorIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: colorIndex * 0.1 }}
                        className="space-y-3"
                      >
                        {/* Color Header Skeleton */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-2" />
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          </div>
                          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>

                        {/* Variants Grid Skeleton */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((variantIndex) => (
                              <div
                                key={variantIndex}
                                className="border rounded-lg p-4 bg-white"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center">
                                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mr-2" />
                                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                                  </div>
                                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                                </div>

                                <div className="pl-6 space-y-3">
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
                                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                    <div className="flex justify-between">
                                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                  </div>

                                  <div>
                                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                                    <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
                                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mt-1" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 border-t flex justify-between">
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="flex gap-3">
                  <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
