"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store-context";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/actions/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { store, storeId } = useStore();
  const { addItem } = useCart();
  const { toast } = useToast();
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: Number(product.basePrice.value),
      image: "",
      quantity: 1,
      storeId: product.business._id,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group"
        >
          <Link href={`${base}/products/${product.slug}`} className="block">
            {/* <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
              {product?.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div> */}
          </Link>

          <div className="flex flex-col">
            <Link href={`${base}/products/${product.slug}`} className="block">
              <h3 className="text-lg font-medium mb-1">{product.name}</h3>
            </Link>

            <div className="mb-3 flex items-center">
              <span
                className="font-medium"
                style={{ color: store.colors.primary }}
              >
                {formatCurrency(Number(product.basePrice.value))}
              </span>

              {/* {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <span className="ml-2 text-sm line-through text-gray-500">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )} */}
            </div>

            <Button
              onClick={() => handleAddToCart(product)}
              style={{
                backgroundColor: store.colors.primary,
                color: store.colors.background,
              }}
              className="mt-auto"
            >
              Add to Cart
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
