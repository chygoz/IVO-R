"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store-context";
import { useCart } from "@/providers/cart-provider";
import { useProducts } from "@/hooks/use-store-data";
import { getContrastingTextColor } from "@/lib/color";

interface ProductDetail {
  _id: string;
  name: string;
  code: string;
  status: string;
  mode: string;
  slug: string;
  description: string;
  sizeFit: string;
  gender: string;
  basePrice: {
    currency: string;
    value: string;
  };
  variants: Array<{
    _id: string;
    name: string;
    code: string;
    hex: string;
    status: string;
    gallery: Array<{
      url: string;
      _id: string;
    }>;
    active: boolean;
    sizes: Array<{
      sku: string;
      active: boolean;
      quantity: number;
      status: string;
      name: string;
      code: string;
      displayName: string;
      sortOrder: number;
    }>;
  }>;
  business: {
    _id: string;
    name: string;
    slug: string;
  };
  stockStatus: string;
  quantity: number;
}

interface ProductDetailPageProps {
  params: {
    storeId: string;
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { store, storeId } = useStore();
  const { colors } = store;
  const { addItem, isLoading: cartLoading } = useCart();
  const { products: relatedProducts } = useProducts(4);
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch product details
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        // Get slug from params or extract from pathname as fallback
        const productSlug = params.slug || pathname.split('/products/')[1]?.split('/')[0] || pathname.split('/').pop();
        
        if (!productSlug) {
          throw new Error("Product slug not found");
        }
        
        // Use storeId from context (works for both subdomain and path-based routing)
        const response = await fetch(
          `/api/stores/${storeId}/products/${productSlug}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        if (data.success) {
          setProduct(data.data);
          console.log(data.data);
          // Set default variant and size
          if (data.data.variants.length > 0) {
            setSelectedVariant(data.data.variants[0]._id);
            if (data.data.variants[0].sizes.length > 0) {
              setSelectedSize(data.data.variants[0].sizes[0].code);
            }
          }
        } else {
          throw new Error("Product not found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.slug, params.storeId]);

  const currentVariant = product?.variants.find(
    (v) => v._id === selectedVariant
  );
  const currentSize = currentVariant?.sizes.find(
    (s) => s.code === selectedSize
  );
  const currentImages = currentVariant?.gallery || [];
  const maxQuantity = currentSize?.quantity || 0;

  const handleAddToCart = async () => {
    if (!product || !currentVariant || !currentSize) {
      alert("Please select variant and size");
      return;
    }

    try {
      await addItem(product._id, quantity, {
        size: {
          code: currentSize.code,
          name: currentSize.displayName,
        },
        code: currentVariant.code,
        hex: currentVariant.hex,
      });
    } catch (error) {
      alert("Failed to add item to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-current"
          style={{ borderTopColor: colors.primary }}
        ></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1
            className="text-2xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Product not found
          </h1>
          <Link
            href={`${base}/products`}
            className="px-6 py-3 rounded-lg font-medium"
            style={{
              backgroundColor: colors.primary,
              color: colors.background,
            }}
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-[1300px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              href={base || "/"}
              className="hover:opacity-70"
              style={{ color: colors.text }}
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href={`${base}/products`}
              className="hover:opacity-70"
              style={{ color: colors.text }}
            >
              Products
            </Link>
            <span>/</span>
            <span className="capitalize" style={{ color: colors.primary }}>
              {product.name}
            </span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4  ">
            {/* Main Image */}
            <motion.div
              className="aspect-square relative overflow-hidden rounded-lg bg-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {currentImages.length > 0 ? (
                <Image
                  src={currentImages[currentImageIndex]?.url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {currentImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {currentImages.map((image, index) => (
                  <button
                    key={image._id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${currentImageIndex === index
                      ? "border-current"
                      : "border-gray-200"
                      }`}
                    style={{
                      backgroundColor: `#F0F0F0`,
                      borderColor:
                        currentImageIndex === index
                          ? colors.primary
                          : "#e5e7eb",
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="max-w-[331px] space-y-6 ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1
                className="text-2xl capitalize md:text-3xl mb-2"
                style={{ color: colors.text }}
              >
                {product.name}
              </h1>

              {store.settings?.showPrices && (
                <div className="mb-6">
                  <span className="text-lg" style={{ color: colors.text }}>
                    {product.basePrice.currency === "USD" ? "$" : "₦"}
                    {parseFloat(product.basePrice.value).toLocaleString()}
                  </span>
                  {product.mode === "on-sale" && (
                    <span
                      className="ml-3 px-3 py-1 rounded-full text-sm font-bold uppercase"
                      style={{
                        backgroundColor: `${colors.primary}20`,
                        color: colors.primary,
                      }}
                    >
                      On Sale
                    </span>
                  )}
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                {product.stockStatus === "in-stock" ? (
                  <span className="text-green-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
            </motion.div>

            {/* Variant Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              {/* Color/Variant Selection */}
              <div>
                <h3 className="text-xs mb-3" style={{ color: colors.text }}>
                  Color
                </h3>
                <div className="flex space-x-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => {
                        setSelectedVariant(variant._id);
                        setCurrentImageIndex(0);
                        if (variant.sizes.length > 0) {
                          setSelectedSize(variant.sizes[0].code);
                        }
                      }}
                      className={`rounded-[99px] capitalize flex px-3 py-2 text-sm relative  `}
                      style={{
                        backgroundColor: variant.hex,
                        color: getContrastingTextColor(variant.hex),
                        borderColor:
                          selectedVariant === variant._id
                            ? colors.primary
                            : "#e5e7eb",
                      }}
                      title={variant.name}
                    >
                      {selectedVariant === variant._id && (
                        <div className="absolute left-0 top-0 size-2 rounded-full texborder-2 border-current pointer-events-none bg-green-500 text-white"></div>
                      )}
                      <span className="sr-only">{variant.name}</span>
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              {currentVariant && currentVariant.sizes.length > 0 && (
                <div>
                  <h3 className="text-xs mb-3" style={{ color: colors.text }}>
                    Size
                  </h3>
                  <Select
                    value={selectedSize}
                    onValueChange={(value) => setSelectedSize(value)}
                  >
                    <SelectTrigger
                      className="w-[180px]"
                      style={{
                        borderColor: colors.primary,
                        color: colors.text,
                        backgroundColor: colors.background,
                      }}
                    >
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        backgroundColor: colors.background,
                        color: colors.text,
                      }}
                    >
                      {currentVariant.sizes
                        .filter((size) => size.active && size.quantity > 0)
                        .map((size) => (
                          <SelectItem
                            key={size.code}
                            value={size.code}
                            style={{
                              color: colors.text,
                            }}
                          >
                            {size.displayName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Quantity Selection */}
              {product.stockStatus === "in-stock" && currentSize && (
                <div>
                  <h3 className="text-xs mb-3" style={{ color: colors.text }}>
                    Quantity
                  </h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border  flex items-center justify-center font-bold"
                      style={{
                        borderColor: colors.primary,
                        color: colors.primary,
                      }}
                    >
                      -
                    </button>
                    <span
                      className="w-16 text-center font-bold"
                      style={{ color: colors.text }}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(quantity + 1))
                      }
                      className="w-10 h-10 border flex items-center justify-center font-bold"
                      style={{
                        borderColor: colors.primary,
                        color: colors.primary,
                      }}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm opacity-70 mt-2">
                    {/* {maxQuantity} available */}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Add to Cart Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button
                onClick={handleAddToCart}
                disabled={
                  product.stockStatus !== "in-stock" ||
                  !currentSize ||
                  cartLoading
                }
                className="w-full py-4 px-6 border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                }}
              >
                {cartLoading
                  ? "Adding..."
                  : product.stockStatus !== "in-stock"
                    ? "Out of Stock"
                    : "Add to Cart"}
              </button>
            </motion.div>

            {/* Product Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="border-t pt-6"
              style={{ borderColor: `${colors.text}20` }}
            >
              <p className="leading-relaxed" style={{ color: colors.text }}>
                {product.description || "No description available."}
              </p>

              {product.sizeFit && (
                <div className="mt-4">
                  <h4 className="font-bold mb-2" style={{ color: colors.text }}>
                    Size & Fit
                  </h4>
                  <p style={{ color: colors.text }}>{product.sizeFit}</p>
                </div>
              )}

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-medium">Gender:</span> {product.gender}
                </p>
                <p className="capitalize">
                  <span className="font-medium ">Business:</span>{" "}
                  {product.business.name}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.filter((related) => related._id !== product._id)
          .length > 0 && (
            <section className="mt-16">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-2xl" style={{ color: colors.text }}>
                  You might also like
                </h2>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts
                  .filter((related) => related._id !== product._id)
                  .slice(0, 4)
                  .map((relatedProduct, index) => (
                    <motion.div
                      key={relatedProduct._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group"
                    >
                      <Link
                        href={`${base}/products/${relatedProduct.slug}`}
                        className="block"
                      >
                        <div className="aspect-square relative overflow-hidden mb-3">
                          <Image
                            src={
                              relatedProduct.variants?.[0]?.gallery?.[0]?.url ||
                              "/placeholder-product.jpg"
                            }
                            alt={relatedProduct.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="capitalize text-sm mb-1 group-hover:opacity-70 transition-opacity">
                          {relatedProduct.name}
                        </h3>
                        {store.settings?.showPrices && (
                          <p className="" style={{ color: colors.text }}>
                            {relatedProduct.basePrice.currency === "USD"
                              ? "$"
                              : "₦"}
                            {parseFloat(
                              relatedProduct.basePrice.value
                            ).toLocaleString()}
                          </p>
                        )}
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </section>
          )}
      </div>
    </div>
  );
}
