"use client";
import { motion } from "framer-motion";

export function LoadingTemplate() {
  return (
    <div className="min-h-screen bg-white">
      {/* Loading Header */}
      <div className="h-16 border-b border-gray-100 px-4 flex items-center justify-between">
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex space-x-4">
          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Loading Hero */}
      <div className="h-96 relative overflow-hidden">
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <svg
              className="w-12 h-12 text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Loading Product Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="w-48 h-8 bg-gray-200 rounded mx-auto mb-12 animate-pulse"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <div className="aspect-square bg-gray-200 rounded animate-pulse"></div>
                <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-1/4 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
        </div>
      </div>

      {/* Loading Feature Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="w-48 h-8 bg-gray-200 rounded mx-auto mb-12 animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center space-y-3 p-6"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Loading Newsletter */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-64 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Loading Footer */}
      <div className="py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
          </div>

          <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between">
            <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Shimmer animation overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["100%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
              repeatDelay: 0.5,
            }}
            style={{ width: "300%" }}
          />
        </div>
      </div>
    </div>
  );
}
