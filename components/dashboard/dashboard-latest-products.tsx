"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useStore } from "@/contexts/reseller-store-context";

// Mock data for latest products
const MOCK_PRODUCTS = [
  {
    id: "PROD-1234",
    name: "Wireless Headphones",
    price: "$89.99",
    image: "/placeholder.png",
    stock: 25,
  },
  {
    id: "PROD-1235",
    name: "Smart Watch",
    price: "$129.99",
    image: "/placeholder.png",
    stock: 15,
  },
  {
    id: "PROD-1236",
    name: "Bluetooth Speaker",
    price: "$49.99",
    image: "/placeholder.png",
    stock: 8,
  },
];

export function LatestProducts({ storeId }: { storeId: string }) {
  const [loading, setLoading] = useState(true);
  const { store } = useStore();

  // In a real app, you would fetch products data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-md"
          />
        ))}
      </div>
    );

  const { primaryColor } = store.storefront.theme;
  const themeColor = primaryColor || "#4f46e5";

  return (
    <div className="space-y-4">
      {MOCK_PRODUCTS.length > 0 ? (
        <>
          <div className="space-y-3">
            {MOCK_PRODUCTS.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-md border hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      Stock: {product.stock}
                    </p>
                  </div>
                </div>
                <p className="font-medium">{product.price}</p>
              </motion.div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full">
            View all products
            <ArrowRight size={14} className="ml-2" />
          </Button>
        </>
      ) : (
        <div className="text-center py-8">
          <Package className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No products yet</p>
        </div>
      )}
    </div>
  );
}
