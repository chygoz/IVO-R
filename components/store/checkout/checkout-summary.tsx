"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store-context";
import { DHL_Product } from "@/types/shipping";
import { ShoppingBag, Truck, Calculator } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  variant: {
    size: { code: string; name: string };
    code: string;
    hex: string;
  };
  price: { currency: string; value: number };
  name: string;
  addedAt: string;
}

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  currency: string;
  selectedShippingRate: DHL_Product | null;
  step: "shipping" | "payment" | "processing";
}

export function CheckoutSummary({
  items,
  subtotal,
  currency,
  selectedShippingRate,
  step,
}: CheckoutSummaryProps) {
  const { store } = useStore();
  const { colors } = store;

  const themeStyles = {
    primary: { backgroundColor: colors.primary },
    primaryText: { color: colors.primary },
    accent: { backgroundColor: colors.accent },
  };

  const shippingCost = useMemo(() => {
    return selectedShippingRate?.totalPrice[0]?.price || 0;
  }, [selectedShippingRate]);

  const total = useMemo(() => {
    return subtotal + shippingCost;
  }, [subtotal, shippingCost]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTotalItems = (): number => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4"
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" style={themeStyles.primaryText} />
            Order Summary
            <Badge variant="secondary" className="ml-auto">
              {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Items */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
              >
                {/* Product Color Indicator */}
                <div
                  className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: item.variant.hex }}
                  title={`Color: ${item.variant.code}`}
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>Size: {item.variant.size.name}</span>
                    <span>•</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>

                <p className="font-semibold text-sm">
                  {formatPrice(item.price.value * item.quantity)}
                </p>
              </motion.div>
            ))}
          </div>

          <Separator />

          {/* Pricing Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({getTotalItems()} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {/* Shipping */}
            {step !== "shipping" && selectedShippingRate ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    <span>Shipping</span>
                  </div>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {selectedShippingRate.productName} •{" "}
                  {selectedShippingRate.deliveryCapabilities.totalTransitDays}{" "}
                  business days
                </p>
              </motion.div>
            ) : step === "shipping" ? (
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>Shipping</span>
                </div>
                <span>Calculated at next step</span>
              </div>
            ) : null}

            {/* Tax (if applicable) */}
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>

            <Separator />

            {/* Total */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex justify-between text-lg font-bold"
            >
              <span>Total</span>
              <span style={themeStyles.primaryText}>
                {step === "shipping"
                  ? formatPrice(subtotal)
                  : formatPrice(total)}
              </span>
            </motion.div>

            {/* Savings indicator */}
            {/* {shippingCost > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-green-600 text-center"
              >
                <Calculator className="w-3 h-3 inline mr-1" />
                Free shipping on orders over ₦50,000
              </motion.div>
            )} */}
          </div>

          {/* Promo Code Section */}
          {step === "payment" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="pt-4 border-t"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1"
                  //@ts-expect-error
                  style={{ focusRingColor: colors.primary }}
                />
                <button
                  className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity"
                  style={themeStyles.primary}
                >
                  Apply
                </button>
              </div>
            </motion.div>
          )}

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Your payment information is secure</span>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
