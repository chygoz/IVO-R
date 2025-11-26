"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store-context";

interface SkeletonLoadingProps {
  type?: "products" | "product-detail" | "cart" | "generic";
}

export function SkeletonLoading({ type = "generic" }: SkeletonLoadingProps) {
  const { store } = useStore();
  const { colors } = store;

  const storeSkeletonClass = `animate-pulse rounded`;

  const getSkeletonStyle = () => ({
    backgroundColor: `${colors.primary}15`,
  });

  if (type === "products") {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header Skeleton */}
        <div className="py-12" style={{ backgroundColor: colors.primary }}>
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div
                className={`${storeSkeletonClass} h-12 w-64 mx-auto mb-4`}
                style={{ backgroundColor: `${colors.background}30` }}
              />
              <div
                className={`${storeSkeletonClass} h-6 w-96 mx-auto`}
                style={{ backgroundColor: `${colors.background}20` }}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Skeleton */}
            <div className="lg:w-1/4">
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3">
                    <div
                      className={`${storeSkeletonClass} h-5 w-24`}
                      style={getSkeletonStyle()}
                    />
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <div
                          key={j}
                          className={`${storeSkeletonClass} h-4 w-32`}
                          style={getSkeletonStyle()}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <div
                  className={`${storeSkeletonClass} h-5 w-32`}
                  style={getSkeletonStyle()}
                />
                <div
                  className={`${storeSkeletonClass} h-10 w-40`}
                  style={getSkeletonStyle()}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(12)
                  .fill(0)
                  .map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div
                        className={`${storeSkeletonClass} aspect-square mb-3`}
                        style={getSkeletonStyle()}
                      />
                      <div
                        className={`${storeSkeletonClass} h-4 w-full mb-2`}
                        style={getSkeletonStyle()}
                      />
                      <div
                        className={`${storeSkeletonClass} h-4 w-3/4`}
                        style={getSkeletonStyle()}
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "product-detail") {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.background }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Skeleton */}
            <div>
              <div
                className={`${storeSkeletonClass} aspect-square mb-4`}
                style={getSkeletonStyle()}
              />
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`${storeSkeletonClass} w-20 h-20`}
                    style={getSkeletonStyle()}
                  />
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <div>
                <div
                  className={`${storeSkeletonClass} h-8 w-3/4 mb-2`}
                  style={getSkeletonStyle()}
                />
                <div
                  className={`${storeSkeletonClass} h-6 w-1/2 mb-4`}
                  style={getSkeletonStyle()}
                />
                <div
                  className={`${storeSkeletonClass} h-8 w-32`}
                  style={getSkeletonStyle()}
                />
              </div>

              <div className="space-y-4">
                <div
                  className={`${storeSkeletonClass} h-5 w-20`}
                  style={getSkeletonStyle()}
                />
                <div className="flex space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`${storeSkeletonClass} w-12 h-12 rounded-full`}
                      style={getSkeletonStyle()}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div
                  className={`${storeSkeletonClass} h-5 w-16`}
                  style={getSkeletonStyle()}
                />
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`${storeSkeletonClass} w-16 h-10`}
                      style={getSkeletonStyle()}
                    />
                  ))}
                </div>
              </div>

              <div
                className={`${storeSkeletonClass} h-12 w-full`}
                style={getSkeletonStyle()}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "cart") {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <div className="py-12" style={{ backgroundColor: colors.primary }}>
          <div className="container mx-auto px-4 text-center">
            <div
              className={`${storeSkeletonClass} h-10 w-48 mx-auto mb-4`}
              style={{ backgroundColor: `${colors.background}30` }}
            />
            <div
              className={`${storeSkeletonClass} h-6 w-32 mx-auto`}
              style={{ backgroundColor: `${colors.background}20` }}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 border rounded-lg"
                  style={{ borderColor: `${colors.text}20` }}
                >
                  <div
                    className={`${storeSkeletonClass} w-24 h-24`}
                    style={getSkeletonStyle()}
                  />
                  <div className="flex-1 space-y-3">
                    <div
                      className={`${storeSkeletonClass} h-5 w-3/4`}
                      style={getSkeletonStyle()}
                    />
                    <div
                      className={`${storeSkeletonClass} h-4 w-1/2`}
                      style={getSkeletonStyle()}
                    />
                    <div className="flex justify-between">
                      <div
                        className={`${storeSkeletonClass} h-8 w-24`}
                        style={getSkeletonStyle()}
                      />
                      <div
                        className={`${storeSkeletonClass} h-6 w-16`}
                        style={getSkeletonStyle()}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="p-6 border rounded-lg space-y-4"
                style={{ borderColor: `${colors.text}20` }}
              >
                <div
                  className={`${storeSkeletonClass} h-6 w-32`}
                  style={getSkeletonStyle()}
                />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div
                      className={`${storeSkeletonClass} h-4 w-20`}
                      style={getSkeletonStyle()}
                    />
                    <div
                      className={`${storeSkeletonClass} h-4 w-16`}
                      style={getSkeletonStyle()}
                    />
                  </div>
                  <div className="flex justify-between">
                    <div
                      className={`${storeSkeletonClass} h-4 w-16`}
                      style={getSkeletonStyle()}
                    />
                    <div
                      className={`${storeSkeletonClass} h-4 w-12`}
                      style={getSkeletonStyle()}
                    />
                  </div>
                </div>
                <div
                  className={`${storeSkeletonClass} h-12 w-full`}
                  style={getSkeletonStyle()}
                />
                <div
                  className={`${storeSkeletonClass} h-10 w-full`}
                  style={getSkeletonStyle()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generic skeleton
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div
            className={`${storeSkeletonClass} h-8 w-1/3`}
            style={getSkeletonStyle()}
          />
          <div
            className={`${storeSkeletonClass} h-4 w-full`}
            style={getSkeletonStyle()}
          />
          <div
            className={`${storeSkeletonClass} h-4 w-3/4`}
            style={getSkeletonStyle()}
          />
          <div
            className={`${storeSkeletonClass} h-64 w-full`}
            style={getSkeletonStyle()}
          />
        </div>
      </div>
    </div>
  );
}
