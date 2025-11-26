"use client";
import React from "react";
import { Package, ShoppingBag, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const EmptyProducts = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full p-8">
      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col items-center text-center p-6">
          <div className="relative mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
            <Package className="w-8 h-8 text-gray-300 absolute -bottom-2 -right-2" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No Products Found
          </h2>

          <p className="text-gray-500 mb-6">
            We couldn&apos;t find any products at the moment. Please check back
            later or try refreshing the page.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.refresh()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </Button>

            <Button
              onClick={() => router.back()}
              className="flex bg-primary items-center gap-2"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyProducts;
