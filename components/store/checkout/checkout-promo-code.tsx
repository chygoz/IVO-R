"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store-context";
import { Tag, Check, X, Percent, Gift, Zap, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PromoCode {
  code: string;
  type: "percentage" | "fixed" | "shipping";
  value: number;
  description: string;
  minimumOrder?: number;
  expiresAt?: string;
  usageLimit?: number;
  usedCount?: number;
}

interface AppliedPromo {
  code: string;
  discount: number;
  type: "percentage" | "fixed" | "shipping";
  description: string;
}

interface CheckoutPromoCodeProps {
  subtotal: number;
  currency: string;
  appliedPromos: AppliedPromo[];
  onApplyPromo: (
    code: string
  ) => Promise<{ success: boolean; promo?: AppliedPromo; error?: string }>;
  onRemovePromo: (code: string) => void;
  isLoading?: boolean;
}

const suggestedPromoCodes: PromoCode[] = [
  // {
  //   code: "WELCOME10",
  //   type: "percentage",
  //   value: 10,
  //   description: "10% off your first order",
  //   minimumOrder: 5000,
  // },
  // {
  //   code: "FREESHIP",
  //   type: "shipping",
  //   value: 0,
  //   description: "Free shipping on any order",
  // },
  // {
  //   code: "SAVE5000",
  //   type: "fixed",
  //   value: 5000,
  //   description: "₦5,000 off orders over ₦25,000",
  //   minimumOrder: 25000,
  // },
];

export function CheckoutPromoCode({
  subtotal,
  currency,
  appliedPromos,
  onApplyPromo,
  onRemovePromo,
  isLoading = false,
}: CheckoutPromoCodeProps) {
  const { store } = useStore();
  const { colors } = store;

  const [promoCode, setPromoCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const themeStyles = {
    primary: { backgroundColor: colors.primary },
    primaryText: { color: colors.primary },
    accent: { backgroundColor: colors.accent },
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setError("Please enter a promo code");
      return;
    }

    setIsApplying(true);
    setError("");

    try {
      const result = await onApplyPromo(promoCode.trim().toUpperCase());

      if (result.success) {
        setPromoCode("");
        setShowSuggestions(false);
      } else {
        setError(result.error || "Invalid promo code");
      }
    } catch (err) {
      setError("Failed to apply promo code");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSuggestedPromo = async (code: string) => {
    setPromoCode(code);
    setError("");

    setIsApplying(true);
    try {
      const result = await onApplyPromo(code);
      if (result.success) {
        setPromoCode("");
        setShowSuggestions(false);
      } else {
        setError(result.error || "This promo code is not available");
      }
    } catch (err) {
      setError("Failed to apply promo code");
    } finally {
      setIsApplying(false);
    }
  };

  const getPromoIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return Percent;
      case "fixed":
        return Tag;
      case "shipping":
        return Zap;
      default:
        return Gift;
    }
  };

  const getDiscountText = (promo: AppliedPromo): string => {
    switch (promo.type) {
      case "percentage":
        return `${promo.discount}% off`;
      case "fixed":
        return `${formatPrice(promo.discount)} off`;
      case "shipping":
        return "Free shipping";
      default:
        return formatPrice(promo.discount);
    }
  };

  const calculateTotalDiscount = (): number => {
    return appliedPromos.reduce((total, promo) => {
      if (promo.type === "percentage") {
        return total + (subtotal * promo.discount) / 100;
      }
      return total + promo.discount;
    }, 0);
  };

  const getEligiblePromoCodes = (): PromoCode[] => {
    return suggestedPromoCodes.filter((promo) => {
      // Check if already applied
      if (appliedPromos.some((applied) => applied.code === promo.code)) {
        return false;
      }

      // Check minimum order requirement
      if (promo.minimumOrder && subtotal < promo.minimumOrder) {
        return false;
      }

      return true;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5" style={themeStyles.primaryText} />
          Promo Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Promo Code Input */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  setError("");
                }}
                placeholder="Enter promo code"
                className={error ? "border-red-500" : ""}
                disabled={isApplying || isLoading}
                onKeyPress={(e) => e.key === "Enter" && handleApplyPromo()}
              />
            </div>
            <Button
              onClick={handleApplyPromo}
              disabled={isApplying || isLoading || !promoCode.trim()}
              className="px-6"
              style={themeStyles.primary}
            >
              {isApplying ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </div>

        {/* Applied Promo Codes */}
        <AnimatePresence>
          {appliedPromos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <h4 className="font-medium text-sm">Applied Codes</h4>
              {appliedPromos.map((promo) => {
                const Icon = getPromoIcon(promo.type);
                return (
                  <motion.div
                    key={promo.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 bg-green-100 rounded">
                        <Icon className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">
                          {promo.code}
                        </p>
                        <p className="text-xs text-green-600">
                          {promo.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 text-white">
                        {getDiscountText(promo)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemovePromo(promo.code)}
                        className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}

              {/* Total Savings */}
              {calculateTotalDiscount() > 0 && (
                <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-800">
                      Total Savings
                    </span>
                    <span className="text-lg font-bold text-green-800">
                      {formatPrice(calculateTotalDiscount())}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggested Promo Codes */}
        {getEligiblePromoCodes().length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Available Offers</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-xs"
                style={themeStyles.primaryText}
              >
                {showSuggestions ? "Hide" : "Show"} (
                {getEligiblePromoCodes().length})
              </Button>
            </div>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {getEligiblePromoCodes().map((promo, index) => {
                    const Icon = getPromoIcon(promo.type);
                    const isEligible =
                      !promo.minimumOrder || subtotal >= promo.minimumOrder;

                    return (
                      <motion.div
                        key={promo.code}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          isEligible
                            ? "hover:shadow-md border-gray-200 hover:border-gray-300"
                            : "bg-gray-50 border-gray-100 opacity-60"
                        }`}
                        onClick={() =>
                          isEligible && handleSuggestedPromo(promo.code)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${colors.primary}15` }}
                            >
                              <Icon
                                className="w-4 h-4"
                                style={themeStyles.primaryText}
                              />
                            </div>
                            <div>
                              <p className="font-medium">{promo.code}</p>
                              <p className="text-xs text-gray-600">
                                {promo.description}
                              </p>
                              {promo.minimumOrder &&
                                subtotal < promo.minimumOrder && (
                                  <p className="text-xs text-orange-600 mt-1">
                                    Minimum order:{" "}
                                    {formatPrice(promo.minimumOrder)}
                                  </p>
                                )}
                            </div>
                          </div>
                          {isEligible && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isApplying}
                              style={{
                                borderColor: colors.primary,
                                color: colors.primary,
                              }}
                            >
                              Apply
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Promo Code Help */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Gift className="w-4 h-4 text-gray-500 mt-0.5" />
            <div className="text-xs text-gray-600">
              <p className="font-medium mb-1">How to use promo codes:</p>
              <ul className="space-y-1">
                <li>• Enter your code in the field above</li>
                <li>• Codes are case-insensitive</li>
                <li>• Some codes have minimum order requirements</li>
                <li>• You can apply multiple codes if eligible</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
