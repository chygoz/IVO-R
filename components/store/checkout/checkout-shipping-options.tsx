"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store-context";
import { DHL_Product } from "@/types/shipping";
import { Truck, Clock, Shield, Info, Star, Zap, Package } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShippingOption extends DHL_Product {
  category: "standard" | "express" | "premium";
  features: string[];
  savings?: number;
  popular?: boolean;
  recommended?: boolean;
}

interface CheckoutShippingOptionsProps {
  shippingRates: DHL_Product[];
  selectedRate: DHL_Product | null;
  onSelect: (rate: DHL_Product) => void;
  isLoading?: boolean;
  currency: string;
}

export function CheckoutShippingOptions({
  shippingRates,
  selectedRate,
  onSelect,
  isLoading = false,
  currency,
}: CheckoutShippingOptionsProps) {
  const { store } = useStore();
  const { colors } = store;
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const themeStyles = {
    primary: { backgroundColor: colors.primary },
    primaryText: { color: colors.primary },
    border: { borderColor: colors.primary },
  };

  const enhancedShippingOptions: ShippingOption[] = useMemo(() => {
    return shippingRates.map((rate) => {
      const transitDays = rate.deliveryCapabilities.totalTransitDays;
      let category: "standard" | "express" | "premium" = "standard";
      let features: string[] = [];
      let popular = false;
      let recommended = false;

      // Categorize based on delivery time and service
      if (transitDays <= 1) {
        category = "premium";
        features = [
          "Same/Next day delivery",
          "Real-time tracking",
          "SMS updates",
          "Premium support",
        ];
        recommended = true;
      } else if (transitDays <= 3) {
        category = "express";
        features = [
          "Express delivery",
          "Package tracking",
          "SMS notifications",
        ];
        popular = true;
      } else {
        category = "standard";
        features = ["Standard delivery", "Basic tracking"];
      }

      // Add service-specific features
      if (rate.productName.toLowerCase().includes("express")) {
        features.push("Express handling");
      }
      if (rate.productName.toLowerCase().includes("domestic")) {
        features.push("Domestic service");
      }

      return {
        ...rate,
        category,
        features,
        popular,
        recommended,
      };
    });
  }, [shippingRates]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "premium":
        return Zap;
      case "express":
        return Clock;
      default:
        return Truck;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "premium":
        return "bg-purple-100 text-purple-800";
      case "express":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" style={themeStyles.primaryText} />
            Shipping Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (enhancedShippingOptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" style={themeStyles.primaryText} />
            Shipping Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              No shipping options available for your location.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" style={themeStyles.primaryText} />
          Choose Shipping Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {enhancedShippingOptions.map((option, index) => {
          const Icon = getCategoryIcon(option.category);
          const isSelected = selectedRate?.productCode === option.productCode;
          const price = option.totalPrice[0]?.price || 0;

          return (
            <motion.div
              key={option.productCode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <motion.div
                className={`border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "ring-2 ring-offset-2 shadow-lg"
                    : "hover:shadow-md hover:border-gray-300"
                }`}
                style={
                  isSelected
                    ? //@ts-expect-error
                      { ...themeStyles.border, ringColor: colors.primary }
                    : {}
                }
                onClick={() => onSelect(option)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Popular/Recommended Badges */}
                {(option.popular || option.recommended) && (
                  <div className="absolute -top-2 left-4 z-10">
                    <Badge
                      className={`${
                        option.recommended
                          ? "bg-green-500 text-white"
                          : "bg-orange-500 text-white"
                      } shadow-sm`}
                    >
                      {option.recommended ? (
                        <>
                          <Star className="w-3 h-3 mr-1" />
                          Recommended
                        </>
                      ) : (
                        "Popular"
                      )}
                    </Badge>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${colors.primary}15` }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={themeStyles.primaryText}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">
                            {option.productName}
                          </h4>
                          <Badge className={getCategoryColor(option.category)}>
                            {option.category}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {option.deliveryCapabilities.totalTransitDays}{" "}
                            business day
                            {option.deliveryCapabilities.totalTransitDays !== 1
                              ? "s"
                              : ""}
                          </p>

                          <p className="text-sm text-gray-600">
                            <Shield className="w-4 h-4 inline mr-1" />
                            Estimated delivery:{" "}
                            {formatDate(
                              option.deliveryCapabilities
                                .estimatedDeliveryDateAndTime
                            )}
                          </p>
                        </div>

                        {/* Features */}
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {option.features.slice(0, 2).map((feature, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                            {option.features.length > 2 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 px-2 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDetails(
                                          showDetails === option.productCode
                                            ? null
                                            : option.productCode
                                        );
                                      }}
                                    >
                                      +{option.features.length - 2} more
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="space-y-1">
                                      {option.features
                                        .slice(2)
                                        .map((feature, idx) => (
                                          <p key={idx} className="text-xs">
                                            {feature}
                                          </p>
                                        ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className="text-xl font-bold"
                        style={themeStyles.primaryText}
                      >
                        {formatPrice(price)}
                      </p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-2"
                        >
                          <Badge
                            style={themeStyles.primary}
                            className="text-white"
                          >
                            Selected
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {showDetails === option.productCode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h5 className="font-medium mb-2">
                              Service Details
                            </h5>
                            <ul className="space-y-1 text-gray-600">
                              <li>• Product Code: {option.productCode}</li>
                              <li>
                                • Weight: {option.weight.provided}{" "}
                                {option.weight.unitOfMeasurement}
                              </li>
                              <li>• Network: {option.networkTypeCode}</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">
                              Pickup & Delivery
                            </h5>
                            <ul className="space-y-1 text-gray-600">
                              <li>
                                • Pickup:{" "}
                                {option.pickupCapabilities.nextBusinessDay
                                  ? "Next business day"
                                  : "Standard"}
                              </li>
                              <li>
                                • Delivery type:{" "}
                                {option.deliveryCapabilities.deliveryTypeCode}
                              </li>
                              <li>
                                • Service area:{" "}
                                {
                                  option.deliveryCapabilities
                                    .destinationServiceAreaCode
                                }
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        {option.totalPriceBreakdown.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-medium mb-2">
                              Price Breakdown
                            </h5>
                            <div className="space-y-1">
                              {option.totalPriceBreakdown[0]?.priceBreakdown.map(
                                (breakdown, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-sm text-gray-600"
                                  >
                                    <span>
                                      {breakdown.typeCode === "STTXA"
                                        ? "Tax"
                                        : "Base Rate"}
                                    </span>
                                    <span>{formatPrice(breakdown.price)}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Shipping Information */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-500 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Shipping Information</p>
              <ul className="space-y-1">
                <li>
                  • All delivery times are estimates and may vary based on
                  location and weather conditions
                </li>
                <li>
                  • You will receive tracking information once your order is
                  shipped
                </li>
                {/* <li>• Free shipping is available on orders over ₦50,000</li> */}
                <li>• Contact support for expedited shipping options</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
