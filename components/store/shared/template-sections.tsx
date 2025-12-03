"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store-context";
import {
  useProducts,
  useCategories,
  useCollections,
} from "@/hooks/use-store-data";

interface HeroSectionProps {
  style?: "bold" | "classic" | "minimal" | "modern" | "luxury";
}

export function HeroSection({ style = "bold" }: HeroSectionProps) {
  const { store, storeId } = useStore();
  const { colors } = store;
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";

  const headline = store.headline || getDefaultHeadline(style);
  const subtext = store.subtext || getDefaultSubtext(style);

  if (style === "bold") {
    return (
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
            style={{ color: colors.background }}
          >
            <h1 className="text-4xl md:text-6xl font-bold uppercase mb-6">
              {headline}
            </h1>
            <p className="text-xl mb-8 opacity-80">{subtext}</p>
            <Link
              href={`${base}/products`}
              className="inline-block px-8 py-4 text-lg font-bold transition-transform hover:scale-105"
              style={{
                backgroundColor: colors.background,
                color: colors.primary,
              }}
            >
              SHOP NOW
            </Link>
          </motion.div>
        </div>
        {store.banner && (
          <div className="container mx-auto px-4 mt-8">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <Image
                src={store.banner}
                alt="Store banner"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}
      </section>
    );
  }

  if (style === "luxury") {
    return (
      <section className="h-[80vh] relative overflow-hidden">
        <motion.div className="absolute inset-0">
          <Image
            src={store.banner || "/default-luxury-hero.jpg"}
            alt="Luxury shopping experience"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
        </motion.div>

        <div className="relative h-full flex flex-col justify-end container mx-auto px-4 md:px-6 pb-20">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-white max-w-3xl"
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl text-white/90 mt-4 max-w-2xl"
          >
            {subtext}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8"
          >
            <Link
              href={`${base}/products`}
              className="px-8 py-4 bg-white text-black font-medium hover:bg-opacity-90 transition-all"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  // Default/other styles
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded border">
          <Image
            src={store.banner || "/default-hero.jpg"}
            alt="Store banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white px-4"
            >
              <h1 className="text-3xl md:text-5xl font-serif mb-4">
                {headline}
              </h1>
              <p className="max-w-md mx-auto mb-6 text-white/90">{subtext}</p>
              <Link
                href={`${base}/products`}
                className="inline-block px-8 py-3 border border-white hover:bg-white hover:text-black transition-colors"
              >
                Explore Collection
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeaturedProductsProps {
  limit?: number;
  style?: "bold" | "classic" | "minimal" | "modern" | "luxury";
}

export function FeaturedProductsSection({
  limit = 4,
  style = "bold",
}: FeaturedProductsProps) {
  const { store, storeId } = useStore();
  const { products, loading, error } = useProducts(limit);
  const { colors } = store;
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(limit)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  const getSectionStyles = () => {
    switch (style) {
      case "bold":
        return {
          section: { backgroundColor: colors.accent },
          title: { color: colors.background },
          titleClass: "text-3xl font-bold uppercase",
        };
      case "luxury":
        return {
          section: { backgroundColor: colors.background },
          title: { color: colors.primary },
          titleClass: "text-3xl font-serif",
        };
      default:
        return {
          section: { backgroundColor: "rgb(249 250 251)" },
          title: { color: colors.primary },
          titleClass: "text-2xl font-serif",
        };
    }
  };

  const sectionStyles = getSectionStyles();

  return (
    <section className="py-16" style={sectionStyles.section}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2
            className={sectionStyles.titleClass + " mb-2"}
            style={sectionStyles.title}
          >
            {style === "bold" ? "Trending Now" : "Featured Products"}
          </h2>
          {style !== "minimal" && (
            <div
              className="w-16 h-px mb-4"
              style={{ backgroundColor: colors.primary }}
            />
          )}
        </motion.div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(
            limit,
            4
          )} gap-6`}
        >
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`${base}/products/${product._id}`} className="block">
                <div className="aspect-square relative overflow-hidden mb-3 rounded-lg">
                  <Image
                    //@ts-expect-error
                    src={product.image || "/placeholder-product.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium mb-1">{product.name}</h3>
                {store.settings?.showPrices && (
                  <p className="font-bold" style={{ color: colors.primary }}>
                    {store.settings.currency === "USD" ? "$" : "₦"}
                    {/*@ts-expect-error*/}
                    {product.price.toFixed(2)}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`${base}/products`}
            className="inline-block px-8 py-3 transition-colors"
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
  );
}

interface CategoriesSectionProps {
  style?: "bold" | "classic" | "minimal" | "modern" | "luxury";
}

export function CategoriesSection({ style = "bold" }: CategoriesSectionProps) {
  const { store, storeId } = useStore();
  const { categories, loading, error } = useCategories();
  const { colors } = store;
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2
            className={
              style === "bold"
                ? "text-3xl font-bold uppercase"
                : "text-2xl font-serif mb-2"
            }
            style={{ color: colors.primary }}
          >
            {style === "bold" ? "Collections" : "Shop by Category"}
          </h2>
          {style !== "bold" && style !== "minimal" && (
            <div
              className="w-16 h-px mb-4"
              style={{ backgroundColor: colors.primary }}
            />
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.slice(0, 4).map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative aspect-square overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <div
                className="absolute inset-0"
                style={{
                  //@ts-expect-error
                  backgroundColor: category.image
                    ? "transparent"
                    : colors.primary,
                }}
              >
                {/*@ts-expect-error*/}
                {category.image && (
                  <Image
                    //@ts-expect-error
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="absolute inset-0 flex items-end p-8 z-20">
                <div>
                  <h3
                    className="text-3xl font-bold uppercase mb-2"
                    style={{ color: colors.background }}
                  >
                    {category.name}
                  </h3>
                  <Link
                    href={`${base}/categories/${category._id}`}
                    className="inline-block text-lg font-medium transition-transform group-hover:translate-x-2"
                    style={{ color: colors.background }}
                  >
                    View Collection →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper functions

function getDefaultHeadline(style: string): string {
  switch (style) {
    case "bold":
      return "Bold & Vibrant";
    case "classic":
      return "Timeless Classics";
    case "minimal":
      return "Simple. Elegant. Minimal.";
    case "modern":
      return "Modern Design For Contemporary Living";
    case "luxury":
      return "Timeless elegance for the discerning customer";
    default:
      return "Welcome to Our Store";
  }
}

function getDefaultSubtext(style: string): string {
  switch (style) {
    case "bold":
      return "Statement pieces that make a lasting impression. Designed for those who dare to stand out.";
    case "classic":
      return "Discover our collection of enduring designs that never go out of style.";
    case "minimal":
      return "Discover our carefully curated collection of minimalist products that combine form and function with timeless design.";
    case "modern":
      return "Discover our collection of thoughtfully designed products for the modern lifestyle. Clean lines, functional forms, and sustainable materials.";
    case "luxury":
      return "Experience luxury redefined through our carefully curated collection of premium products.";
    default:
      return "Discover our amazing collection of quality products.";
  }
}

interface NewsletterSectionProps {
  style?: "bold" | "classic" | "minimal" | "modern" | "luxury";
}

export function NewsletterSection({ style = "bold" }: NewsletterSectionProps) {
  const { store } = useStore();
  const { colors } = store;

  const getSectionStyles = () => {
    switch (style) {
      case "bold":
        return {
          section: {
            backgroundColor: colors.primary,
            color: colors.background,
          },
          input:
            "flex-1 px-4 py-3 bg-transparent border border-white/40 focus:outline-none uppercase text-sm",
          button: { backgroundColor: colors.background, color: colors.primary },
          title: "text-3xl font-bold uppercase mb-6",
        };
      case "luxury":
        return {
          section: { backgroundColor: colors.background },
          input: "flex-1 px-4 py-3 border focus:outline-none",
          button: { backgroundColor: colors.primary, color: colors.background },
          title: "text-2xl font-serif mb-4",
        };
      default:
        return {
          section: { backgroundColor: "rgb(249 250 251)" },
          input: "flex-1 px-4 py-2 border focus:outline-none",
          button: { backgroundColor: colors.primary, color: colors.background },
          title: "text-2xl font-serif mb-4",
        };
    }
  };

  const sectionStyles = getSectionStyles();

  return (
    <section className="py-16" style={sectionStyles.section}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={sectionStyles.title}>
              {style === "bold" ? "Join the Movement" : "Stay Connected"}
            </h2>
            <p className="text-lg mb-8 opacity-80">
              Subscribe to our newsletter for exclusive offers, new releases,
              and inspiration delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder={
                  style === "bold" ? "YOUR EMAIL" : "Your email address"
                }
                className={sectionStyles.input}
                style={
                  style === "bold"
                    ? undefined
                    : { borderColor: `${colors.text}20` }
                }
              />
              <button
                className="px-6 py-3 font-bold transition-colors"
                style={sectionStyles.button}
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

interface AboutSectionProps {
  style?: "bold" | "classic" | "minimal" | "modern" | "luxury";
}

export function AboutSection({ style = "bold" }: AboutSectionProps) {
  const { store, storeId } = useStore();
  const { colors } = store;
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";

  const getContent = () => {
    switch (style) {
      case "bold":
        return {
          title: "Make a Statement",
          content: [
            "Our brand was founded on the principle that fashion should be bold, expressive, and unapologetic. We create pieces that empower you to showcase your unique style.",
            "Each design is crafted with attention to detail, using premium materials that ensure both quality and durability.",
          ],
          cta: "Our Story",
        };
      case "classic":
        return {
          title: "Our Heritage",
          content: [
            "Since 1985, we have been dedicated to creating timeless products that combine traditional craftsmanship with elegant design.",
            "Our commitment to quality and attention to detail ensures that each piece stands the test of time, becoming more cherished with every passing year.",
          ],
          cta: "Read Our Story",
        };
      case "minimal":
        return {
          title: "Our Philosophy",
          content: [
            "We believe in creating products that stand the test of time. Our minimalist approach focuses on quality materials, thoughtful design, and sustainable practices.",
          ],
          cta: "Learn More",
        };
      case "modern":
        return {
          title: "Our Design Philosophy",
          content: [
            "We believe that good design solves problems while creating beauty. Our products are crafted with attention to detail, using sustainable materials and ethical production methods.",
            "Each piece is designed to be functional, durable, and aesthetically pleasing, creating harmony in your space and life.",
          ],
          cta: "Learn More",
        };
      case "luxury":
        return {
          title: "Craftsmanship Excellence",
          content: [
            "Every piece in our collection represents the pinnacle of luxury craftsmanship, where traditional techniques meet contemporary design.",
            "We work with master artisans who share our commitment to excellence, ensuring each product meets our exacting standards.",
          ],
          cta: "Our Heritage",
        };
      default:
        return {
          title: "About Us",
          content: [
            "We are passionate about creating exceptional products that enhance your lifestyle.",
          ],
          cta: "Learn More",
        };
    }
  };

  const content = getContent();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square"
            style={{ backgroundColor: `${colors.primary}10` }}
          >
            <Image
              src="/about-image.jpg"
              alt="About us"
              fill
              className="object-cover rounded-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2
              className={
                style === "bold"
                  ? "text-3xl font-bold uppercase mb-6"
                  : "text-3xl font-serif mb-6"
              }
              style={{ color: colors.primary }}
            >
              {content.title}
            </h2>

            {style !== "bold" && style !== "minimal" && (
              <div
                className="w-16 h-px mb-6"
                style={{ backgroundColor: colors.primary }}
              />
            )}

            {content.content.map((paragraph, index) => (
              <p key={index} className="text-lg mb-6">
                {paragraph}
              </p>
            ))}

            <Link
              href={`${base}/about`}
              className="inline-block px-6 py-3 text-lg font-bold transition-transform hover:scale-105"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              {content.cta}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
