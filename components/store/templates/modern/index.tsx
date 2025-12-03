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

export function ModernTemplate() {
  const { store, storeId } = useStore();
  const { colors, headline, subtext, banner } = store;
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";
  const { products, loading: productsLoading } = useProducts(4);
  const { categories, loading: categoriesLoading } = useCategories();

  const defaultHeadline = headline || "Modern Design For Contemporary Living";
  const defaultSubtext =
    subtext ||
    "Discover our collection of thoughtfully designed products for the modern lifestyle. Clean lines, functional forms, and sustainable materials.";

  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: `${colors.primary}05` }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
                style={{ color: colors.primary }}
              >
                {defaultHeadline}
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                {defaultSubtext}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={`${base}/products`}
                  className="inline-block px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                  }}
                >
                  Shop Now
                </Link>

                <Link
                  href={`${base}/about`}
                  className="inline-block px-8 py-4 rounded-lg border-2 font-medium transition-all duration-300 hover:bg-current hover:text-white"
                  style={{
                    borderColor: colors.primary,
                    color: colors.primary,
                  }}
                >
                  Our Story
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden"
              style={{
                backgroundColor: banner ? "transparent" : colors.primary,
              }}
            >
              {banner ? (
                <Image
                  src={banner}
                  alt="Modern design"
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: colors.background }}
                  >
                    Modern
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {!categoriesLoading && categories.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.primary }}
              >
                Shop by Category
              </h2>
              <div
                className="w-20 h-1 mb-6 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                Explore our curated collections organized to make your shopping
                experience simple and enjoyable.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.slice(0, 3).map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`${base}/products?category=${category.slug}`} className="block">
                    <div
                      className="h-80 relative rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: `${colors.primary}10` }}
                    >
                      <Image
                        src={getCategoryImage(category)}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {category.name}
                        </h3>
                        <span className="text-white/80 font-medium">
                          Explore →
                        </span>
                      </div>
                    </div>
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
          className="py-16 md:py-24"
          style={{ backgroundColor: `${colors.primary}05` }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.primary }}
              >
                Trending Now
              </h2>
              <div
                className="w-20 h-1 mb-6 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                Discover our most popular products that define modern living.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <Link href={`${base}/products/${product.slug}`} className="block">
                    <div className="aspect-square relative overflow-hidden">
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
                    <div className="p-6">
                      <h3
                        className="font-semibold text-lg mb-2"
                        style={{ color: colors.primary }}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        {store.settings?.showPrices && (
                          <p
                            className="font-bold text-lg"
                            style={{ color: colors.primary }}
                          >
                            {product.basePrice.currency === "USD" ? "$" : "₦"}
                            {getProductPrice(product).toLocaleString()}
                          </p>
                        )}
                        {product.mode === "on-sale" && (
                          <span
                            className="text-xs px-3 py-1 rounded-full font-medium"
                            style={{
                              backgroundColor: colors.accent,
                              color: colors.background,
                            }}
                          >
                            Sale
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href={`${base}/products`}
                className="inline-block px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Design Philosophy */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-8"
                style={{ color: colors.primary }}
              >
                Our Design Philosophy
              </h2>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe that good design solves problems while creating
                beauty. Our products are crafted with attention to detail, using
                sustainable materials and ethical production methods.
              </p>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Each piece is designed to be functional, durable, and
                aesthetically pleasing, creating harmony in your space and life.
              </p>

              <Link
                href={`${base}/about`}
                className="inline-block px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                Learn More
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div
                className="aspect-square rounded-2xl overflow-hidden"
                style={{ backgroundColor: `${colors.primary}20` }}
              >
                <Image
                  src="/laptop.png"
                  alt="Design process"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="aspect-square rounded-2xl"
                style={{ backgroundColor: `${colors.primary}10` }}
              ></div>
              <div
                className="aspect-square rounded-2xl"
                style={{ backgroundColor: `${colors.primary}15` }}
              ></div>
              <div
                className="aspect-square rounded-2xl overflow-hidden"
                style={{ backgroundColor: `${colors.primary}25` }}
              >
                <Image
                  src="/laptop.png"
                  alt="Modern lifestyle"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter & Social */}
      <section
        className="py-16 md:py-24 rounded-t-3xl"
        style={{ backgroundColor: colors.primary, color: colors.background }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Stay Updated
              </h2>
              <p className="text-lg md:text-xl opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed">
                Subscribe to our newsletter to receive updates on new products,
                special offers, and design inspiration.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-12">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-6 py-4 rounded-lg bg-white/10 border border-white/20 focus:outline-none text-lg placeholder-white/70"
                />
                <button
                  className="px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.primary,
                  }}
                >
                  Subscribe
                </button>
              </div>

              <div className="flex justify-center space-x-6">
                {["Instagram", "Pinterest", "Facebook", "Twitter"].map(
                  (social) => (
                    <a
                      key={social}
                      href={`https://${social.toLowerCase()}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-300 font-medium"
                    >
                      {social}
                    </a>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ModernTemplate;
