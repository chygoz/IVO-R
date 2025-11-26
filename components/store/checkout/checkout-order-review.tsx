"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store-context";
import { DHL_Product, ShippingAddress } from "@/types/shipping";
import {
  Edit,
  MapPin,
  Truck,
  Package,
  CreditCard,
  User,
  Mail,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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

interface CheckoutOrderReviewProps {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  selectedShippingRate: DHL_Product;
  subtotal: number;
  currency: string;
  onEditShipping: () => void;
  onEditBilling: () => void;
  onEditShippingMethod: () => void;
  onEditItems: () => void;
}

export function CheckoutOrderReview({
  items,
  shippingAddress,
  billingAddress,
  selectedShippingRate,
  subtotal,
  currency,
  onEditShipping,
  onEditBilling,
  onEditShippingMethod,
  onEditItems,
}: CheckoutOrderReviewProps) {
  const { store } = useStore();
  const { colors } = store;

  const themeStyles = {
    primary: { backgroundColor: colors.primary },
    primaryText: { color: colors.primary },
    accent: { backgroundColor: colors.accent },
  };

  const shippingCost = selectedShippingRate.totalPrice[0]?.price || 0;
  const tax = 0; // Calculate tax if applicable
  const total = subtotal + shippingCost + tax;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTotalItems = (): number => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      {/* Order Items Review */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" style={themeStyles.primaryText} />
                Order Items ({getTotalItems()})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditItems}
                className="text-sm"
                style={themeStyles.primaryText}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  {/* Product Color */}
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 flex items-center justify-center"
                    style={{ backgroundColor: item.variant.hex }}
                  >
                    <div className="w-8 h-8 rounded-md border border-white/20" />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>Size: {item.variant.size.name}</span>
                      <span>Color: {item.variant.code}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(item.price.value * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500">
                        {formatPrice(item.price.value)} each
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shipping Address Review */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" style={themeStyles.primaryText} />
                Shipping Address
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditShipping}
                className="text-sm"
                style={themeStyles.primaryText}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p>{shippingAddress.address}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state}{" "}
                    {shippingAddress.zip}
                  </p>
                  <p>{shippingAddress.country}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{shippingAddress.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{shippingAddress.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Billing Address Review (if different) */}
      {billingAddress._id !== shippingAddress._id && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard
                    className="w-5 h-5"
                    style={themeStyles.primaryText}
                  />
                  Billing Address
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEditBilling}
                  className="text-sm"
                  style={themeStyles.primaryText}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">
                    {billingAddress.firstName} {billingAddress.lastName}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p>{billingAddress.address}</p>
                    <p>
                      {billingAddress.city}, {billingAddress.state}{" "}
                      {billingAddress.zip}
                    </p>
                    <p>{billingAddress.country}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{billingAddress.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{billingAddress.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Shipping Method Review */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" style={themeStyles.primaryText} />
                Shipping Method
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditShippingMethod}
                className="text-sm"
                style={themeStyles.primaryText}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {selectedShippingRate.productName}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>
                    {selectedShippingRate.deliveryCapabilities.totalTransitDays}{" "}
                    business days
                  </span>
                  <Badge variant="outline">
                    {selectedShippingRate.networkTypeCode}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Estimated delivery:{" "}
                  {formatDate(
                    selectedShippingRate.deliveryCapabilities
                      .estimatedDeliveryDateAndTime
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">
                  {formatPrice(shippingCost)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" style={themeStyles.primaryText} />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal ({getTotalItems()} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>

              {tax > 0 && (
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span style={themeStyles.primaryText}>
                  {formatPrice(total)}
                </span>
              </div>

              {/* Savings callout */}
              {total > 50000 && (
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 text-sm font-medium">
                    🎉 You saved on shipping! Orders over ₦50,000 qualify for
                    discounted rates.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
