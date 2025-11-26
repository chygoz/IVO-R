"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import {
  useProducts,
  useCategories,
  getProductImage,
  getProductPrice,
  getCategoryImage,
  isProductInStock,
} from "@/hooks/use-store-data";

export function MinimalTemplate() {
  const { store } = useStore();
  const { colors, headline, subtext, banner } = store;
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const base = `/${(pathname.split("/")[1] || "").trim()}`;
  const { products, loading: productsLoading } = useProducts(4);
  const { categories, loading: categoriesLoading } = useCategories();

  const defaultHeadline = headline || "Less is More";
  const defaultSubtext =
    subtext ||
    "Discover our carefully curated collection of minimalist products that combine form and function with timeless design.";

  return (
    <div>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-tight"
              style={{ color: colors.primary }}
            >
              {defaultHeadline}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              {defaultSubtext}
            </p>
            <Link
              href={`${base}/products`}
              className="inline-block px-8 py-3 border transition-all duration-300 hover:bg-black hover:text-white hover:border-black"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
              }}
            >
              Browse Collection
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-square"
            style={{ backgroundColor: banner ? "transparent" : colors.primary }}
          >
            {banner ? (
              <Image
                src={banner}
                alt="Minimal collection"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span
                  className="text-4xl font-light"
                  style={{ color: colors.background }}
                >
                  Minimal
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      {!categoriesLoading && categories.length > 0 && (
        <section
          className="py-20"
          style={{ backgroundColor: `${colors.primary}03` }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <h2
                className="text-3xl md:text-4xl font-light mb-8"
                style={{ color: colors.primary }}
              >
                Shop by Category
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {categories.slice(0, 3).map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={`${base}/products?category=${category.slug}`}
                    className="block group"
                  >
                    <div className="aspect-square relative overflow-hidden bg-white mb-6">
                      <Image
                        src={getCategoryImage(category)}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="text-center">
                      <h3
                        className="text-xl md:text-2xl font-light"
                        style={{ color: colors.primary }}
                      >
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {!productsLoading && products.length > 0 && (
        <section className="py-20 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2
              className="text-3xl md:text-4xl font-light mb-8"
              style={{ color: colors.primary }}
            >
              New Arrivals
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`${base}/products/${product.slug}`} className="block">
                  <div className="aspect-square relative overflow-hidden bg-gray-50 mb-4">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {!isProductInStock(product) && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="text-gray-600 font-light">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3
                      className="text-lg font-light"
                      style={{ color: colors.primary }}
                    >
                      {product.name}
                    </h3>
                    {store.settings?.showPrices && (
                      <p className="text-gray-600">
                        {product.basePrice.currency === "USD" ? "$" : "₦"}
                        {getProductPrice(product).toLocaleString()}
                      </p>
                    )}
                    {product.mode === "on-sale" && (
                      <span
                        className="inline-block text-xs px-2 py-1"
                        style={{
                          backgroundColor: colors.primary,
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

          <div className="mt-16 text-center">
            <Link
              href={`${base}/products`}
              className="inline-block px-8 py-3 border transition-all duration-300 hover:bg-black hover:text-white hover:border-black"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
              }}
            >
              View All Products
            </Link>
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      <section
        className="py-20"
        style={{ backgroundColor: `${colors.primary}03` }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-light mb-8"
              style={{ color: colors.primary }}
            >
              Our Philosophy
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
            >
              We believe in creating products that stand the test of time. Our
              minimalist approach focuses on quality materials, thoughtful
              design, and sustainable practices that honor both form and
              function.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Every piece is carefully considered, removing the unnecessary to
              reveal the essential. This is design at its purest form.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-light mb-8"
            style={{ color: colors.primary }}
          >
            Stay Connected
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 mb-10 leading-relaxed"
          >
            Subscribe to our newsletter for updates on new products, exclusive
            offers, and insights into minimal living.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 border focus:outline-none"
              style={{ borderColor: `${colors.text}20` }}
            />
            <button
              className="px-6 py-3 font-light transition-colors hover:opacity-90"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              Subscribe
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default MinimalTemplate;
