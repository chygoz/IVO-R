"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store-context";
import Image from "next/image";

export function StoreLoading() {
  const { store } = useStore();
  const { colors, template, name } = store;

  // Get template-specific styling
  const getTemplateStyles = () => {
    switch (template) {
      case "bold":
        return {
          titleClass: "text-2xl font-bold uppercase",
          textClass: "text-lg font-medium",
          spinnerSize: "w-20 h-20",
          pulseEffect: true,
        };
      case "luxury":
        return {
          titleClass: "text-2xl font-serif font-light",
          textClass: "text-lg font-light",
          spinnerSize: "w-16 h-16",
          pulseEffect: true,
        };
      case "minimal":
        return {
          titleClass: "text-xl font-light",
          textClass: "text-base font-light",
          spinnerSize: "w-12 h-12",
          pulseEffect: false,
        };
      case "modern":
        return {
          titleClass: "text-2xl font-medium",
          textClass: "text-lg",
          spinnerSize: "w-16 h-16",
          pulseEffect: true,
        };
      case "classic":
        return {
          titleClass: "text-xl font-serif",
          textClass: "text-base",
          spinnerSize: "w-16 h-16",
          pulseEffect: false,
        };
      default:
        return {
          titleClass: "text-xl font-medium",
          textClass: "text-base",
          spinnerSize: "w-16 h-16",
          pulseEffect: true,
        };
    }
  };

  const styles = getTemplateStyles();

  const getBackgroundStyle = () => {
    if (template === "bold") {
      return {
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primary}05 100%)`,
      };
    }
    return { backgroundColor: colors.background };
  };

  const getLoadingText = () => {
    switch (template) {
      case "bold":
        return {
          title: `Loading ${name}...`,
          subtitle: "Get ready for something bold!",
        };
      case "luxury":
        return {
          title: `Preparing ${name}`,
          subtitle: "Crafting your luxury experience...",
        };
      case "minimal":
        return {
          title: "Loading...",
          subtitle: "Just a moment",
        };
      case "modern":
        return {
          title: `Loading ${name}`,
          subtitle: "Preparing your modern shopping experience",
        };
      case "classic":
        return {
          title: `Welcome to ${name}`,
          subtitle: "Loading our timeless collection...",
        };
      default:
        return {
          title: `Loading ${name}...`,
          subtitle: "Please wait while we prepare your experience",
        };
    }
  };

  const loadingText = getLoadingText();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={getBackgroundStyle()}
    >
      <div className="text-center max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* Store Logo or Spinner */}
          <div className="relative flex justify-center mb-6">
            {store.logo ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <Image
                  src={store.logo}
                  width={400}
                  height={400}
                  alt={name}
                  className="h-16 w-auto object-contain"
                />
                {/* Loading ring around logo */}
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-transparent rounded-full"
                  style={{
                    borderTopColor: colors.primary,
                    width: "80px",
                    height: "80px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </motion.div>
            ) : (
              <div className="relative">
                {/* Main Spinner */}
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className={`${styles.spinnerSize} border-4 border-gray-200 rounded-full mx-auto`}
                  style={{ borderTopColor: colors.primary }}
                />

                {/* Pulsing Ring for certain templates */}
                {styles.pulseEffect && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className={`absolute inset-0 border-2 rounded-full`}
                    style={{ borderColor: colors.primary }}
                  />
                )}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2
            className={styles.titleClass + " mb-2"}
            style={{ color: colors.primary }}
          >
            {loadingText.title}
          </h2>
          <p
            className={styles.textClass + " opacity-80"}
            style={{ color: colors.text }}
          >
            {loadingText.subtitle}
          </p>
        </motion.div>

        {/* Loading Animation based on template */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          {template === "bold" ? (
            // Bold style: Bouncing bars
            <div className="flex justify-center space-x-2">
              {[0, 1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  initial={{ scaleY: 1 }}
                  animate={{ scaleY: [1, 2, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: index * 0.1,
                  }}
                  className="w-1 h-4 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              ))}
            </div>
          ) : template === "luxury" ? (
            // Luxury style: Elegant dots
            <div className="flex justify-center space-x-3">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                  className="w-3 h-3 rounded-full border-2"
                  style={{ borderColor: colors.primary }}
                />
              ))}
            </div>
          ) : template === "minimal" ? (
            // Minimal style: Simple progress bar
            <div className="w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-full w-1/3 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
            </div>
          ) : template === "modern" ? (
            // Modern style: Geometric shapes
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                  className="w-3 h-3"
                  style={{ backgroundColor: colors.primary }}
                />
              ))}
            </div>
          ) : (
            // Classic/Default style: Dots
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Additional loading message for slow connections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="mt-6"
        >
          <p className="text-sm opacity-60" style={{ color: colors.text }}>
            {template === "luxury"
              ? "Perfection takes a moment..."
              : template === "bold"
              ? "Loading something amazing..."
              : template === "minimal"
              ? "Almost there..."
              : "Just a few more seconds..."}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
