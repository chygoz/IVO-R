"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store-context";
import {
  useProducts,
  useCategories,
  getProductImage,
  getProductPrice,
  getCategoryImage,
  isProductInStock,
} from "@/hooks/use-store-data";
import { cn } from "@/lib/utils";

export function BoldTemplate() {
  const { store, storeId } = useStore();
  const { colors, headline, subtext, banner } = store;
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";
  const { products, loading: productsLoading } = useProducts(3);
  const { categories, loading: categoriesLoading } = useCategories();

  console.log("store", store);

  const defaultHeadline = headline || "Bold & Vibrant";
  const defaultSubtext =
    subtext ||
    "Statement pieces that make a lasting impression. Designed for those who dare to stand out.";

  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-16 md:py-24 h-screen flex items-center justify-center text-center"
        style={{
          backgroundColor: colors.primary,
          ...(banner
            ? {
              backgroundImage: `url(${banner})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }
            : {}),
        }}
      >
        <div className=" size-[400px] auto px-4 bg-black/30 p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
            style={{ color: colors.background }}
          >
            <h1 className="text-3xl md:text-5xl mb-4">{defaultHeadline}</h1>
            <p className="mb-4">{defaultSubtext}</p>
            <Link
              href={`${base}/products`}
              className="inline-block px-8 py-4 text-base border border-solid transition-transform hover:scale-105"
              style={{
                borderColor: colors.background,
                color: colors.background,
              }}
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories with Large Images */}
      {!categoriesLoading && categories.length > 0 && (
        <section className="py-12">
          <div className="max-w-[1300px] mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2
                className="text-xl md:text-3xl"
                style={{ color: colors.text }}
              >
                Categories
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 grid-rows-2 md:grid-cols-3 gap-2.5">
              {categories.slice(0, 3).map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={cn(
                    index === 0 ? "col-span-2 row-span-2" : "",
                    "group h-full min-h-[280px] flex flex-col   overflow-hidden"
                  )}
                >
                  <div
                    style={{ backgroundColor: `#F0F0F0` }}
                    className="relative h-full grow  w-full"
                  >
                    <Image
                      src={getCategoryImage(category)}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div
                    style={{ backgroundColor: `${colors.primary}10` }}
                    className="flex items-end p-2 "
                  >
                    <div>
                      <Link
                        href={`${base}/products?category=${category.slug}`}
                        className="inline-block text-sm capitalize transition-transform group-hover:translate-x-2"
                        style={{ color: `${colors.text}` }}
                      >
                        {category.name} →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {!productsLoading && products.length > 0 && (
        <section
          className="py-16"
          style={{ backgroundColor: colors.background }}
        >
          <div className="w-full max-w-[1300px] mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10 flex items-center justify-between"
            >
              <h2
                className="text-xl md:text-3xl"
                style={{ color: colors.text }}
              >
                Trending Now
              </h2>
              <div className="text-center">
                <Link
                  href={`${base}/products`}
                  className="inline-block px-8 py-3 transition-transform hover:scale-105"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                  }}
                >
                  View All
                </Link>
              </div>
            </motion.div>

            <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2.5">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                  style={{ backgroundColor: colors.background }}
                >
                  <Link href={`${base}/products/${product.slug}`} className="block">
                    <div
                      style={{ backgroundColor: `#F0F0F0` }}
                      className="h-[170px] md:h-[323px] relative overflow-hidden"
                    >
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 left-2 md:bottom-5 d:left-5 flex flex-col gap-2 z-4">
                        {!isProductInStock(product) && (
                          <span
                            style={{
                              backgroundColor: `#FF000090`,
                              color: "#FFFFFF",
                            }}
                            className=" text-sm px-2 py-1 rounded-3xl w-fit"
                          >
                            Out of Stock
                          </span>
                        )}
                        {product.mode === "on-sale" && (
                          <span
                            className="text-sm  px-2 py-1 rounded-3xl w-fit"
                            style={{
                              backgroundColor: `${colors.primary}20`,
                              color: colors.primary,
                            }}
                          >
                            Sale
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="py-6 pr-6">
                      <h3
                        className="text-xs font-bold capitalize mb-2"
                        style={{ color: colors.text }}
                      >
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        {store.settings?.showPrices && (
                          <span className="" style={{ color: colors.text }}>
                            {product.basePrice.currency === "USD" ? "$" : "₦"}
                            {getProductPrice(product).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Statement */}
      <section className="py-16">
        <div className="max-w-[1300px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2
                className="text-xl md:text-3xl  mb-6"
                style={{ color: colors.text }}
              >
                Make a Statement
              </h2>

              <p className="text-base mb-6">
                Our brand was founded on the principle that fashion should be
                bold, expressive, and unapologetic. We create pieces that
                empower you to showcase your unique style.
              </p>

              <p className="text-base mb-8">
                Each design is crafted with attention to detail, using premium
                materials that ensure both quality and durability.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BoldTemplate;
