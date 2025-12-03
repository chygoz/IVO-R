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

export function ClassicTemplate() {
  const { store, storeId } = useStore();
  const { colors, headline, subtext, banner } = store;
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";
  const { products, loading: productsLoading } = useProducts(4);
  const { categories, loading: categoriesLoading } = useCategories();

  const defaultHeadline = headline || "Timeless Elegance";
  const defaultSubtext =
    subtext ||
    "Discover our collection of enduring designs that never go out of style. Classic pieces crafted with attention to detail and quality.";

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div
            className="relative min-h-[500px] md:min-h-[600px] overflow-hidden border-2 flex items-center justify-center"
            style={{
              borderColor: `${colors.text}30`,
              backgroundColor: banner ? "transparent" : colors.primary,
            }}
          >
            {banner && (
              <Image
                src={banner}
                alt="Classic collection"
                fill
                className="object-cover"
                priority
              />
            )}
            <div
              className={`absolute inset-0 ${banner ? "bg-black/40" : ""
                } flex items-center justify-center`}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center px-4 max-w-3xl"
                style={{ color: banner ? "white" : colors.background }}
              >
                <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
                  {defaultHeadline}
                </h1>
                <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                  {defaultSubtext}
                </p>
                <Link
                  href={`${base}/products`}
                  className="inline-block px-8 py-3 border-2 font-medium transition-all duration-300 hover:bg-current hover:text-white"
                  style={{
                    borderColor: banner ? "white" : colors.background,
                    color: banner ? "white" : colors.background,
                  }}
                >
                  Explore Collection
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {!categoriesLoading && categories.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2
                className="text-3xl md:text-4xl font-serif mb-4"
                style={{ color: colors.primary }}
              >
                Shop by Category
              </h2>
              <div
                className="w-20 h-px mx-auto mb-6"
                style={{ backgroundColor: colors.primary }}
              />
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse our carefully curated collections, each designed to bring
                timeless style to your wardrobe.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Link
                    href={`${base}/products?category=${category.slug}`}
                    className="block text-center"
                  >
                    <div
                      className="aspect-square mb-4 flex items-center justify-center border-2 group-hover:border-opacity-60 transition-all duration-300"
                      style={{ borderColor: `${colors.text}30` }}
                    >
                      <Image
                        src={getCategoryImage(category)}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3
                      className="font-serif text-lg mb-1"
                      style={{ color: colors.primary }}
                    >
                      {category.name}
                    </h3>
                    <span className="text-sm text-gray-600 group-hover:opacity-70 transition-opacity">
                      Shop {category.name}
                    </span>
                  </Link>
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
          style={{ backgroundColor: `${colors.primary}05` }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2
                className="text-3xl md:text-4xl font-serif mb-4"
                style={{ color: colors.primary }}
              >
                Featured Products
              </h2>
              <div
                className="w-20 h-px mx-auto mb-6"
                style={{ backgroundColor: colors.primary }}
              />
              <p className="text-gray-600 max-w-2xl mx-auto">
                Handpicked selections that embody our commitment to classic
                design and exceptional quality.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group text-center bg-white"
                >
                  <Link href={`${base}/products/${product.slug}`} className="block">
                    <div
                      className="aspect-square relative overflow-hidden mb-4 border"
                      style={{ borderColor: `${colors.text}20` }}
                    >
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {!isProductInStock(product) && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <span className="text-gray-700 font-medium">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <h3
                      className="font-serif text-lg mb-2"
                      style={{ color: colors.primary }}
                    >
                      {product.name}
                    </h3>
                    <div className="space-y-1">
                      {store.settings?.showPrices && (
                        <p
                          className="font-medium"
                          style={{ color: colors.primary }}
                        >
                          {product.basePrice.currency === "USD" ? "$" : "₦"}
                          {getProductPrice(product).toLocaleString()}
                        </p>
                      )}
                      {product.mode === "on-sale" && (
                        <span
                          className="inline-block text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: colors.accent,
                            color: colors.background,
                          }}
                        >
                          Sale
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href={`${base}/products`}
                className="inline-block px-8 py-3 border-2 font-medium transition-all duration-300 hover:bg-current hover:text-white"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                }}
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Heritage Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="text-3xl md:text-4xl font-serif mb-6"
                style={{ color: colors.primary }}
              >
                Our Heritage
              </h2>
              <div
                className="w-20 h-px mb-6"
                style={{ backgroundColor: colors.primary }}
              />
              <p className="text-gray-600 mb-6 leading-relaxed">
                Since our founding, we have been dedicated to creating timeless
                products that combine traditional craftsmanship with elegant
                design principles that have endured for generations.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our commitment to quality and attention to detail ensures that
                each piece stands the test of time, becoming more cherished with
                every passing year.
              </p>
              <Link
                href={`${base}/about`}
                className="inline-block font-medium border-b-2 pb-1 transition-colors hover:opacity-70"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                }}
              >
                Read Our Story →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[400px] md:h-[500px] border-2"
              style={{ borderColor: `${colors.text}20` }}
            >
              <Image
                src="/laptop.png"
                alt="Our heritage"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        className="py-16"
        style={{ backgroundColor: `${colors.primary}05` }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="text-3xl md:text-4xl font-serif mb-6"
                style={{ color: colors.primary }}
              >
                Join Our Community
              </h2>
              <div
                className="w-20 h-px mx-auto mb-6"
                style={{ backgroundColor: colors.primary }}
              />
              <p className="text-gray-600 mb-8 leading-relaxed">
                Subscribe to receive updates on new arrivals, special offers,
                and exclusive events. Be part of our classic community.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 border-2 focus:outline-none"
                  style={{ borderColor: `${colors.text}30` }}
                />
                <button
                  className="px-6 py-3 font-medium transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                  }}
                >
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ClassicTemplate;
