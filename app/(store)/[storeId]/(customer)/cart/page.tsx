"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { useCart } from "@/providers/cart-provider";
import Image from "next/image";
export default function CartPage() {
  const { store } = useStore();
  const { colors } = store;
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const base = `/${(pathname.split("/")[1] || "").trim()}`;
  const {
    items,
    totalAmount,
    currency,
    removeItem,
    updateQuantity,
    clearCart,
    switchCurrency,
    isLoading,
    actionLoading,
  } = useCart();

  const isEligibleForFreeShipping = false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-current"
          style={{ borderTopColor: colors.primary }}
        ></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <section className="py-12" style={{ backgroundColor: colors.primary }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1
              className="text-4xl md:text-5xl font-bold uppercase mb-4"
              style={{ color: colors.background }}
            >
              Shopping Cart
            </h1>
            <p
              className="text-xl opacity-80"
              style={{ color: colors.background }}
            >
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          // Empty Cart
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="mb-8">
              <ShoppingBagIcon
                className="w-24 h-24 mx-auto opacity-30"
                style={{ color: colors.text }}
              />
            </div>
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: colors.text }}
            >
              Your cart is empty
            </h2>
            <p
              className="text-lg opacity-70 mb-8"
              style={{ color: colors.text }}
            >
              Looks like you haven&apos;t added anything to your cart yet
            </p>
            <Link
              href={`${base}/products`}
              className="inline-block px-8 py-4 rounded-lg font-bold uppercase text-lg transition-transform hover:scale-105"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Currency Switcher */}
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: colors.text }}
                  >
                    Cart Items
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm" style={{ color: colors.text }}>
                      Currency:
                    </span>
                    <div
                      className="flex border rounded-lg overflow-hidden"
                      style={{ borderColor: `${colors.primary}30` }}
                    >
                      <button
                        onClick={() => switchCurrency("NGN")}
                        className={`px-3 py-1 text-sm font-medium transition-colors ${currency === "NGN" ? "font-bold" : ""
                          }`}
                        style={{
                          backgroundColor:
                            currency === "NGN" ? colors.primary : "transparent",
                          color:
                            currency === "NGN"
                              ? colors.background
                              : colors.text,
                        }}
                        disabled={actionLoading}
                      >
                        NGN
                      </button>
                      <button
                        onClick={() => switchCurrency("USD")}
                        className={`px-3 py-1 text-sm font-medium transition-colors ${currency === "USD" ? "font-bold" : ""
                          }`}
                        style={{
                          backgroundColor:
                            currency === "USD" ? colors.primary : "transparent",
                          color:
                            currency === "USD"
                              ? colors.background
                              : colors.text,
                        }}
                        disabled={actionLoading}
                      >
                        USD
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 border rounded-lg"
                      style={{ borderColor: `${colors.text}20` }}
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <div className="w-full h-full flex items-center justify-center">
                          <Image
                            width={96}
                            height={96}
                            alt={item.name}
                            className="object-cover"
                            src={item.variant.gallery?.[0]?.url || "/placeholder.png"}
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'top',
                            }}
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3
                              className="font-bold text-lg"
                              style={{ color: colors.text }}
                            >
                              {item.name}
                            </h3>
                            <p
                              className="text-sm opacity-70"
                              style={{ color: colors.text }}
                            >
                              Color: {item.variant.code} • Size:{" "}
                              {item.variant.size.name}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item._id)}
                            disabled={actionLoading}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors disabled:opacity-50"
                            title="Remove item"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span
                              className="text-sm"
                              style={{ color: colors.text }}
                            >
                              Qty:
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item._id,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                disabled={actionLoading || item.quantity <= 1}
                                className="w-8 h-8 border rounded-lg flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                  borderColor: colors.primary,
                                  color: colors.primary,
                                }}
                              >
                                -
                              </button>
                              <span
                                className="w-12 text-center font-bold"
                                style={{ color: colors.text }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity + 1)
                                }
                                disabled={actionLoading}
                                className="w-8 h-8 border rounded-lg flex items-center justify-center font-bold disabled:opacity-50"
                                style={{
                                  borderColor: colors.primary,
                                  color: colors.primary,
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <p
                              className="text-lg font-bold"
                              style={{ color: colors.primary }}
                            >
                              {currency === "USD" ? "$" : "₦"}
                              {(
                                item.price.value * item.quantity
                              ).toLocaleString()}
                            </p>
                            <p
                              className="text-sm opacity-70"
                              style={{ color: colors.text }}
                            >
                              {currency === "USD" ? "$" : "₦"}
                              {item.price.value.toLocaleString()} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <div className="pt-4">
                  <button
                    onClick={clearCart}
                    disabled={actionLoading}
                    className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                  >
                    Clear Cart
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-4"
              >
                <div
                  className="p-6 border rounded-lg"
                  style={{ borderColor: `${colors.text}20` }}
                >
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{ color: colors.text }}
                  >
                    Order Summary
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span style={{ color: colors.text }}>Subtotal:</span>
                      <span style={{ color: colors.text }}>
                        {currency === "USD" ? "$" : "₦"}
                        {totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span style={{ color: colors.text }}>Shipping:</span>
                      <span
                        style={{
                          color: isEligibleForFreeShipping
                            ? "green"
                            : colors.text,
                        }}
                      >
                        {isEligibleForFreeShipping
                          ? "Free"
                          : "Calculated at checkout"}
                      </span>
                    </div>

                    <div
                      className="border-t pt-3"
                      style={{ borderColor: `${colors.text}20` }}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className="text-lg font-bold"
                          style={{ color: colors.text }}
                        >
                          Total:
                        </span>
                        <span
                          className="text-xl font-bold"
                          style={{ color: colors.primary }}
                        >
                          {currency === "USD" ? "$" : "₦"}
                          {totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href={`${base}/checkout`}
                      className="block w-full py-3 px-4 text-center rounded-lg font-bold uppercase transition-transform hover:scale-105"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.background,
                      }}
                    >
                      Proceed to Checkout
                    </Link>

                    <Link
                      href={`${base}/products`}
                      className="block w-full py-3 px-4 text-center border rounded-lg font-medium transition-colors"
                      style={{
                        borderColor: colors.primary,
                        color: colors.primary,
                      }}
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Icons
function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
