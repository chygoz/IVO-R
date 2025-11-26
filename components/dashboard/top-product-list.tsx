"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/contexts/reseller-store-context";
import { Package } from "lucide-react";
import Image from "next/image";
import { useApiClient } from "@/lib/api/use-api-client";

interface TopProduct {
  _id: string;
  name: string;
  price: number;
  sales: number;
  image: string;
}

export function TopProductsList({ storeId }: { storeId: string }) {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { store } = useStore();
  const apiClient = useApiClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.seller.get(
          "/api/v1/analytics/dashboard"
        );
        const result = response;

        if (result.success && result.data && result.data.topProducts) {
          setProducts(result.data.topProducts);
        }
      } catch (error) {
        console.error("Failed to fetch top products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <Package className="h-10 w-10 text-gray-300" />
        <p className="mt-2 text-sm text-gray-500">No top products yet</p>
        <p className="text-xs text-gray-400">
          Products will appear here as you make sales
        </p>
      </div>
    );
  }

  const { primaryColor } = store.storefront.theme;
  const themeColor = primaryColor || "#4f46e5";

  return (
    <div className="space-y-3">
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center justify-between p-3 rounded-lg border hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center space-x-3">
            {product.image ? (
              <Image
                width={800}
                height={800}
                src={product.image}
                alt={product.name}
                className="h-10 w-10 rounded-md object-cover"
              />
            ) : (
              <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                <Package size={16} className="text-gray-400" />
              </div>
            )}
            <div>
              <p className="font-medium text-sm line-clamp-1">{product.name}</p>
              <p className="text-xs text-gray-500">{product.sales} sold</p>
            </div>
          </div>
          <div className="font-semibold text-sm" style={{ color: themeColor }}>
            ${product.price.toLocaleString()}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
