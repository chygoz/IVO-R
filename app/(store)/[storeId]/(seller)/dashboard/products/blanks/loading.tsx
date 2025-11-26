"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const BlanksPageSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse mr-4" />
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Skeleton */}
        <div className="w-full md:w-72 space-y-4">
          <Card>
            <CardHeader className="p-4">
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-4 w-full bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid Skeleton */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
                    <div className="flex gap-2 mb-3">
                      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-4">
                    <div className="w-full">
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="flex gap-1">
                        {[1, 2, 3].map((j) => (
                          <div
                            key={j}
                            className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"
                          />
                        ))}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlanksPageSkeleton;
