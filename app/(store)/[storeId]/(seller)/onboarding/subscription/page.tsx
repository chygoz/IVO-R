"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Subscription plan data
const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    billingPeriod: "monthly",
    description: "Perfect for small businesses just getting started",
    features: [
      "Up to 50 products",
      "Basic analytics",
      "Standard support",
      "Single payment option",
      "Basic customization",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: 79,
    billingPeriod: "monthly",
    description: "For growing businesses with more advanced needs",
    features: [
      "Up to 500 products",
      "Advanced analytics",
      "Priority support",
      "Multiple payment options",
      "Advanced customization",
      "Discount codes",
    ],
    recommended: true,
  },
  {
    id: "business",
    name: "Business",
    price: 199,
    billingPeriod: "monthly",
    description: "Enterprise-grade features for larger operations",
    features: [
      "Unlimited products",
      "Premium analytics",
      "Dedicated support",
      "All payment options",
      "Full customization",
      "Discount codes",
      "API access",
      "Custom domain",
    ],
  },
];

export default function SubscriptionPage() {
  const { selectSubscription, isLoading, isExternalSeller } = useAuth();

  const [selectedPlanId, setSelectedPlanId] = useState("pro");
  const [error, setError] = useState<string | null>(null);

  // Only show this page for external sellers
  if (!isExternalSeller) {
    return null;
  }

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await selectSubscription(selectedPlanId);

      if (!result.success) {
        setError(result.error || "Failed to process subscription");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            Choose Your Subscription Plan
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the plan that best fits your business needs. You can upgrade
            or downgrade at any time.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8 max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`h-full flex flex-col ${
                  selectedPlanId === plan.id
                    ? "border-primary ring-2 ring-primary ring-opacity-50"
                    : ""
                } ${plan.recommended ? "relative" : ""}`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium">
                    Recommended
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/{plan.billingPeriod}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={selectedPlanId === plan.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isLoading}
                  >
                    {selectedPlanId === plan.id ? "Selected" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading || !selectedPlanId}
          >
            {isLoading ? "Processing..." : "Continue with Selected Plan"}
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            You will be able to change your plan at any time from your
            dashboard.
          </p>
        </form>
      </motion.div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Step 2 of 3: Subscription Selection</p>
      </div>
    </div>
  );
}
