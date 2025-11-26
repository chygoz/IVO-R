"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store-context";
import {
  Check,
  Package,
  Truck,
  Download,
  ArrowRight,
  Home,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Order {
  orderId: string;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: { value: number; currency: string };
  }>;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface PaymentSuccessModalProps {
  order: Order | undefined | null;
  onClose: () => void;
}

export function PaymentSuccessModal({
  order,
  onClose,
}: PaymentSuccessModalProps) {
  const { store } = useStore();
  const { colors } = store;
  const [showConfetti, setShowConfetti] = useState(true);

  const themeStyles = {
    primary: { backgroundColor: colors.primary },
    primaryText: { color: colors.primary },
    background: { backgroundColor: colors.background },
    backgroundText: { color: colors.background },
  };
  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: number, currency: string): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const estimatedDelivery = (): string => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // Assume 7 days delivery
    return deliveryDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const totalAmount = order?.items?.reduce((acc, item) => {
    return acc + item.price.value * item.quantity;
  }, 0);

  const currency = order?.items?.[0].price.currency;

  if (!order) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      i % 2 === 0 ? colors.primary : colors.accent || "#FFD700",
                    left: `${Math.random() * 100}%`,
                    top: "-10px",
                  }}
                  animate={{
                    y: [0, window.innerHeight],
                    x: [0, (Math.random() - 0.5) * 200],
                    rotate: [0, 360],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: Math.random() * 2,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          <div className="p-8">
            {/* Success Header */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 20 }}
              className="text-center mb-8"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                style={themeStyles.primary}
              >
                <Check
                  className="w-10 h-10"
                  style={themeStyles.backgroundText}
                />
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold mb-2"
                style={themeStyles.primaryText}
              >
                Payment Successful!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-lg"
              >
                Thank you for your purchase. Your order has been confirmed.
              </motion.p>
            </motion.div>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Order #{order.orderId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-2xl font-bold"
                        style={themeStyles.primaryText}
                      >
                        {formatPrice(totalAmount || 0, currency || "NGN")}
                      </p>
                      <p className="text-sm text-gray-600">Total Amount</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Items Ordered ({order.items.length})
                      </h4>
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">
                            {formatPrice(
                              item.price.value * item.quantity,
                              item.price.currency
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <Separator className="my-4" />

                  {/* Shipping Information */}
                  {order.shippingAddress && (
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p>
                          {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName}
                        </p>
                        <p>{order.shippingAddress.address}</p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.zip}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-50 rounded-lg p-6 mb-6"
            >
              <h3 className="font-semibold mb-4">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-2"
                    style={themeStyles.primary}
                  />
                  <div>
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-sm text-gray-600">
                      You&apos;ll receive an email confirmation shortly with
                      your order details.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-2"
                    style={themeStyles.primary}
                  />
                  <div>
                    <p className="font-medium">Processing & Shipping</p>
                    <p className="text-sm text-gray-600">
                      Your order will be processed and shipped within 1-2
                      business days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-2"
                    style={themeStyles.primary}
                  />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-gray-600">
                      Expected delivery by {estimatedDelivery()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                onClick={() => {
                  // Handle download receipt
                  window.print();
                }}
                variant="outline"
                className="flex-1 py-3"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>

              <Button
                onClick={() => {
                  // Handle track order
                  window.open(`/orders/${order.orderId}`, "_blank");
                }}
                variant="outline"
                className="flex-1 py-3"
              >
                <Truck className="w-4 h-4 mr-2" />
                Track Order
              </Button>

              <Button
                onClick={onClose}
                className="flex-1 py-3 font-semibold"
                style={themeStyles.primary}
              >
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-6 pt-6 border-t"
            >
              <p className="text-sm text-gray-600 mb-2">
                Have questions about your order?
              </p>
              <button
                className="text-sm font-medium hover:underline flex items-center gap-1 mx-auto"
                style={themeStyles.primaryText}
                onClick={() =>
                (window.location.href = `mailto:support@${store.domain || "ivocorporate.com"
                  }`)
                }
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
