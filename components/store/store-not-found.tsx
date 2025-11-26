"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { Container } from "@/components/store/shared/container";
import { useProducts } from "@/hooks/use-store-data";
import { getProductImage, getProductPrice } from "@/hooks/use-store-data";
import Image from "next/image";

export function StoreNotFound() {
  const { store } = useStore();
  const { colors, template } = store;
  const { products } = useProducts(4); // Get some products for suggestions

  // Get template-specific styling
  const getTemplateStyles = () => {
    switch (template) {
      case "bold":
        return {
          titleClass: "text-4xl md:text-6xl font-bold uppercase",
          subtitleClass: "text-xl font-bold uppercase",
          textClass: "text-lg",
          buttonClass:
            "px-8 py-4 font-bold uppercase text-lg transition-transform hover:scale-105",
          linkClass: "font-bold uppercase hover:opacity-70 transition-opacity",
        };
      case "luxury":
        return {
          titleClass: "text-4xl md:text-5xl font-serif font-light",
          subtitleClass: "text-xl font-serif",
          textClass: "text-lg font-light",
          buttonClass: "px-8 py-3 font-medium transition-all hover:opacity-90",
          linkClass:
            "font-medium hover:opacity-70 transition-opacity border-b border-current",
        };
      case "minimal":
        return {
          titleClass: "text-3xl md:text-4xl font-light",
          subtitleClass: "text-lg font-light",
          textClass: "text-base",
          buttonClass: "px-6 py-3 font-medium transition-colors border",
          linkClass: "font-medium hover:opacity-70 transition-opacity",
        };
      case "modern":
        return {
          titleClass: "text-4xl md:text-5xl font-bold",
          subtitleClass: "text-xl font-medium",
          textClass: "text-lg",
          buttonClass: "px-8 py-3 rounded-md font-medium transition-colors",
          linkClass:
            "font-medium hover:opacity-70 transition-opacity underline",
        };
      case "classic":
        return {
          titleClass: "text-3xl md:text-4xl font-serif",
          subtitleClass: "text-lg font-serif",
          textClass: "text-base",
          buttonClass: "px-6 py-3 font-medium transition-colors",
          linkClass: "font-medium hover:opacity-70 transition-opacity",
        };
      default:
        return {
          titleClass: "text-4xl md:text-5xl font-bold",
          subtitleClass: "text-xl",
          textClass: "text-lg",
          buttonClass: "px-8 py-3 font-medium transition-colors",
          linkClass: "font-medium hover:opacity-70 transition-opacity",
        };
    }
  };

  const styles = getTemplateStyles();

  const getBackgroundStyle = () => {
    if (template === "bold") {
      return {
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primary}10 100%)`,
      };
    }
    return { backgroundColor: colors.background };
  };

  return (
    <div className="min-h-screen flex flex-col" style={getBackgroundStyle()}>
      {/* Main 404 Content */}
      <div className="flex-1 flex items-center justify-center py-16">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Error Code */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1
                className={styles.titleClass}
                style={{ color: colors.primary }}
              >
                404
              </h1>
              {template === "bold" || template === "classic" ? (
                <div
                  className="w-24 h-1 mx-auto mt-4"
                  style={{ backgroundColor: colors.primary }}
                />
              ) : null}
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h2
                className={`${styles.subtitleClass} mb-4`}
                style={{ color: colors.text }}
              >
                {template === "bold"
                  ? "Page Not Found"
                  : template === "luxury"
                  ? "We apologize, but this page cannot be found"
                  : template === "minimal"
                  ? "Page not found"
                  : "Oops! Page Not Found"}
              </h2>

              <p
                className={`${styles.textClass} opacity-80 max-w-2xl mx-auto`}
                style={{ color: colors.text }}
              >
                {template === "bold"
                  ? "The page you're looking for has moved, been deleted, or doesn't exist. But don't worry - there's plenty more to discover!"
                  : template === "luxury"
                  ? "The page you are seeking appears to have been moved or is temporarily unavailable. We invite you to explore our exquisite collection instead."
                  : template === "minimal"
                  ? "The page you're looking for doesn't exist. Here are some helpful links instead."
                  : "The page you're looking for doesn't exist or has been moved. Let's get you back on track!"}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              {/* Primary CTA */}
              <div className="mb-6">
                <Link
                  href="/"
                  className={`inline-block ${styles.buttonClass}`}
                  style={
                    template === "minimal"
                      ? {
                          borderColor: colors.primary,
                          color: colors.primary,
                          backgroundColor: "transparent",
                        }
                      : {
                          backgroundColor: colors.primary,
                          color: colors.background,
                        }
                  }
                >
                  {template === "bold"
                    ? "Back to Home"
                    : template === "luxury"
                    ? "Return Home"
                    : template === "minimal"
                    ? "Go Home"
                    : "Back to Home"}
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
                <span style={{ color: colors.text }}>
                  {template === "bold"
                    ? "Or explore:"
                    : template === "luxury"
                    ? "Alternatively, you may visit:"
                    : "Continue browsing:"}
                </span>

                <Link
                  href="/products"
                  className={styles.linkClass}
                  style={{ color: colors.primary }}
                >
                  {template === "bold" ? "Shop All" : "Products"}
                </Link>

                <span style={{ color: colors.text }}>•</span>

                <Link
                  href="/collections"
                  className={styles.linkClass}
                  style={{ color: colors.primary }}
                >
                  Collections
                </Link>

                <span style={{ color: colors.text }}>•</span>

                <Link
                  href="/about"
                  className={styles.linkClass}
                  style={{ color: colors.primary }}
                >
                  About
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </div>

      {/* Suggested Products */}
      {products.length > 0 && (
        <section
          className="py-16 border-t"
          style={{ borderColor: `${colors.text}20` }}
        >
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h3
                className={`${styles.subtitleClass} mb-4`}
                style={{ color: colors.primary }}
              >
                {template === "bold"
                  ? "While You're Here"
                  : template === "luxury"
                  ? "Featured Collection"
                  : template === "minimal"
                  ? "You might like"
                  : "Popular Products"}
              </h3>

              {(template === "bold" || template === "classic") && (
                <div
                  className="w-16 h-px mx-auto"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="aspect-square relative overflow-hidden rounded-lg mb-3 bg-gray-100">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <h4
                      className={`${
                        template === "bold"
                          ? "font-bold uppercase"
                          : template === "luxury"
                          ? "font-serif"
                          : template === "minimal"
                          ? "font-light"
                          : "font-medium"
                      } mb-1 group-hover:opacity-70 transition-opacity`}
                      style={{ color: colors.text }}
                    >
                      {product.name}
                    </h4>

                    {store.settings?.showPrices && (
                      <p
                        className={
                          template === "bold" ? "font-bold" : "font-medium"
                        }
                        style={{ color: colors.primary }}
                      >
                        {product.basePrice.currency === "USD" ? "$" : "₦"}
                        {getProductPrice(product).toLocaleString()}
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Link
                href="/products"
                className={`inline-block ${styles.buttonClass}`}
                style={
                  template === "minimal"
                    ? {
                        borderColor: colors.primary,
                        color: colors.primary,
                        backgroundColor: "transparent",
                      }
                    : {
                        backgroundColor: colors.primary,
                        color: colors.background,
                      }
                }
              >
                {template === "bold"
                  ? "View All Products"
                  : template === "luxury"
                  ? "Explore Collection"
                  : template === "minimal"
                  ? "Browse All"
                  : "See All Products"}
              </Link>
            </motion.div>
          </Container>
        </section>
      )}

      {/* Help Section */}
      <section
        className="py-12"
        style={{
          backgroundColor:
            template === "bold" ? colors.primary : `${colors.primary}05`,
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3
              className={`${styles.subtitleClass} mb-4`}
              style={{
                color: template === "bold" ? colors.background : colors.text,
              }}
            >
              {template === "bold"
                ? "Need Help?"
                : template === "luxury"
                ? "Require Assistance?"
                : "Need help?"}
            </h3>

            <p
              className={`${styles.textClass} opacity-80 mb-6`}
              style={{
                color: template === "bold" ? colors.background : colors.text,
              }}
            >
              {template === "bold"
                ? "Can't find what you're looking for? Our team is here to help!"
                : template === "luxury"
                ? "Our concierge team is available to assist you with any inquiries."
                : "If you can't find what you're looking for, we're here to help."}
            </p>

            <Link
              href="/contact"
              className={`inline-block ${styles.buttonClass}`}
              style={
                template === "bold"
                  ? {
                      backgroundColor: colors.background,
                      color: colors.primary,
                    }
                  : template === "minimal"
                  ? {
                      borderColor: colors.primary,
                      color: colors.primary,
                      backgroundColor: "transparent",
                    }
                  : {
                      backgroundColor: colors.primary,
                      color: colors.background,
                    }
              }
            >
              {template === "bold"
                ? "Contact Us"
                : template === "luxury"
                ? "Contact Concierge"
                : template === "minimal"
                ? "Get Help"
                : "Contact Support"}
            </Link>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
