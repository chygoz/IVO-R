"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/providers/cart-provider";
import { useStore } from "@/lib/store-context";
import Image from "next/image";

export function CartSidebar() {
  const { store, storeId } = useStore();
  const pathname = usePathname();
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";
  const {
    isOpen,
    closeCart,
    items,
    totalAmount,
    currency,
    removeItem,
    updateQuantity,
    isLoading,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeCart}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 z-50 flex flex-col"
            style={{ backgroundColor: store.colors.background }}
          >
            {/* Header */}
            <div
              className="p-6 border-b"
              style={{ borderColor: `${store.colors.text}20` }}
            >
              <div className="flex justify-between items-center">
                <h2
                  className="text-xl font-bold"
                  style={{ color: store.colors.text }}
                >
                  Shopping Cart ({items.length})
                </h2>
                <button
                  onClick={closeCart}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon
                    className="w-5 h-5"
                    style={{ color: store.colors.text }}
                  />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <ShoppingBagIcon
                      className="w-16 h-16 mx-auto opacity-30"
                      style={{ color: store.colors.text }}
                    />
                  </div>
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: store.colors.text }}
                  >
                    Your cart is empty
                  </h3>
                  <p
                    className="opacity-70 mb-6"
                    style={{ color: store.colors.text }}
                  >
                    Add some products to get started
                  </p>
                  <Link
                    href={`${base}/products`}
                    onClick={closeCart}
                    className="inline-block px-6 py-3 rounded-lg font-medium"
                    style={{
                      backgroundColor: store.colors.primary,
                      color: store.colors.background,
                    }}
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 p-4 border rounded-lg"
                      style={{ borderColor: `${store.colors.text}20` }}
                    >
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                        {/* You'll need to get the product image from the variant */}
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-gray-400">
                            <Image
                              width={64}
                              height={64}
                              alt={item.name}
                              className="object-cover"
                              src={item.variant.gallery?.[0]?.url || "/placeholder.png"}
                              style={{
                                objectFit: 'cover',
                                objectPosition: 'top',
                              }}
                            />
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <h4
                          className="font-medium mb-1"
                          style={{ color: store.colors.text }}
                        >
                          {item.name}
                        </h4>
                        <p
                          className="text-sm opacity-70"
                          style={{ color: store.colors.text }}
                        >
                          Color: {item.variant.code} • Size:{" "}
                          {item.variant.size.name}
                        </p>
                        <p
                          className="text-sm font-bold"
                          style={{ color: store.colors.primary }}
                        >
                          {currency === "USD" ? "$" : "₦"}
                          {item.price.value.toLocaleString()}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="w-6 h-6 border rounded flex items-center justify-center text-sm"
                              style={{
                                borderColor: store.colors.primary,
                                color: store.colors.primary,
                              }}
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="w-6 h-6 border rounded flex items-center justify-center text-sm"
                              style={{
                                borderColor: store.colors.primary,
                                color: store.colors.primary,
                              }}
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="p-6 border-t"
                style={{ borderColor: `${store.colors.text}20` }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span
                    className="text-lg font-bold"
                    style={{ color: store.colors.text }}
                  >
                    Total:
                  </span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: store.colors.primary }}
                  >
                    {currency === "USD" ? "$" : "₦"}
                    {totalAmount.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <Link
                    href={`${base}/cart`}
                    onClick={closeCart}
                    className="block w-full py-3 px-4 text-center border rounded-lg font-medium transition-colors"
                    style={{
                      borderColor: store.colors.primary,
                      color: store.colors.primary,
                    }}
                  >
                    View Cart
                  </Link>

                  <Link
                    href={`${base}/checkout`}
                    onClick={closeCart}
                    className="block w-full py-3 px-4 text-center rounded-lg font-medium"
                    style={{
                      backgroundColor: store.colors.primary,
                      color: store.colors.background,
                    }}
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  );
}

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
