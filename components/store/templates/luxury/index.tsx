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

export function LuxuryTemplate() {
  const { store, storeId } = useStore();
  const { colors, headline, subtext, banner } = store;
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";
  const { products, loading: productsLoading } = useProducts(3);
  const { categories, loading: categoriesLoading } = useCategories();

  const defaultHeadline = headline || "Luxury Redefined";
  const defaultSubtext =
    subtext ||
    "Experience the finest craftsmanship and unparalleled elegance in every piece. Where heritage meets contemporary sophistication.";

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh]  flex items-center justify-center overflow-hidden">
        {banner ? (
          <div className="absolute w-full h-full inset-0 bg-red-500">
            <Image
              src={banner}
              alt="Luxury collection"
              fill
              className="object-cover w-full h-full aspect-video"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: colors.primary }}
          />
        )}

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-light mb-8 tracking-tight"
              style={{ color: colors.background }}
            >
              {defaultHeadline}
            </h1>
            <p
              className="text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto leading-relaxed opacity-90"
              style={{ color: colors.background }}
            >
              {defaultSubtext}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link
                href={`${base}/products`}
                className="inline-block px-12 py-4 text-lg font-medium tracking-wide border-2 transition-all duration-300 hover:bg-white hover:text-black"
                style={{
                  borderColor: colors.background,
                  color: colors.background,
                }}
              >
                DISCOVER COLLECTION
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      {!categoriesLoading && categories.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2
                className="text-4xl md:text-5xl font-serif font-light mb-6"
                style={{ color: colors.primary }}
              >
                Collections
              </h2>
              <div
                className="w-24 h-px mx-auto"
                style={{ backgroundColor: colors.primary }}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {categories.slice(0, 2).map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="group"
                >
                  <Link href={`${base}/products?category=${category.slug}`} className="block">
                    <div className="relative aspect-[4/5] overflow-hidden mb-8">
                      <Image
                        src={getCategoryImage(category)}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="text-center">
                      <h3
                        className="text-2xl md:text-3xl font-serif font-light mb-2"
                        style={{ color: colors.primary }}
                      >
                        {category.name}
                      </h3>
                      <span
                        className="text-sm tracking-widest uppercase font-medium transition-colors group-hover:opacity-70"
                        style={{ color: colors.primary }}
                      >
                        Explore Collection
                      </span>
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
          className="py-24"
          style={{ backgroundColor: `${colors.primary}05` }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2
                className="text-4xl md:text-5xl font-serif font-light mb-6"
                style={{ color: colors.primary }}
              >
                Signature Pieces
              </h2>
              <div
                className="w-24 h-px mx-auto mb-6"
                style={{ backgroundColor: colors.primary }}
              />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Handpicked selections that embody our commitment to excellence
                and timeless design.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`${base}/products/${product.slug}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden mb-6">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      {!isProductInStock(product) && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <span className="text-gray-800 font-medium tracking-wide">
                            SOLD OUT
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-center space-y-2">
                      <h3
                        className="text-xl font-serif font-light"
                        style={{ color: colors.primary }}
                      >
                        {product.name}
                      </h3>
                      {store.settings?.showPrices && (
                        <p
                          className="text-lg font-medium"
                          style={{ color: colors.primary }}
                        >
                          {product.basePrice.currency === "USD" ? "$" : "₦"}
                          {getProductPrice(product).toLocaleString()}
                        </p>
                      )}
                      {product.mode === "on-sale" && (
                        <span
                          className="inline-block text-xs tracking-wider uppercase px-3 py-1"
                          style={{
                            backgroundColor: colors.accent,
                            color: colors.background,
                          }}
                        >
                          Special Offer
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link
                href={`${base}/products`}
                className="inline-block px-10 py-3 border-2 text-lg font-medium tracking-wide transition-all duration-300 hover:bg-black hover:text-white"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                }}
              >
                VIEW ALL PIECES
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Brand Heritage */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-4xl md:text-5xl font-serif font-light mb-8"
                style={{ color: colors.primary }}
              >
                Heritage of Excellence
              </h2>
              <div
                className="w-24 h-px mb-8"
                style={{ backgroundColor: colors.primary }}
              />
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                For generations, we have been dedicated to creating pieces that
                transcend trends and seasons. Our commitment to exceptional
                craftsmanship and uncompromising quality ensures that each item
                becomes a treasured part of your story.
              </p>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                From the finest materials sourced globally to the skilled
                artisans who bring each design to life, every detail reflects
                our passion for perfection.
              </p>
              <Link
                href={`${base}/about`}
                className="inline-block text-lg font-medium tracking-wide border-b-2 pb-1 transition-colors hover:opacity-70"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                }}
              >
                DISCOVER OUR STORY
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[4/5]"
            >
              <Image
                src="/laptop.png"
                alt="Craftsmanship"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20" style={{ backgroundColor: colors.primary }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3
                className="text-3xl md:text-4xl font-serif font-light mb-6"
                style={{ color: colors.background }}
              >
                Join Our Circle
              </h3>
              <p
                className="text-lg mb-10 opacity-90"
                style={{ color: colors.background }}
              >
                Be the first to discover new collections, exclusive events, and
                private sales reserved for our most valued clients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-6 py-4 bg-transparent border-2 focus:outline-none text-lg"
                  style={{
                    borderColor: colors.background,
                    color: colors.background,
                  }}
                />
                <button
                  className="px-8 py-4 text-lg font-medium tracking-wide transition-all duration-300 hover:opacity-90"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.primary,
                  }}
                >
                  SUBSCRIBE
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LuxuryTemplate;
