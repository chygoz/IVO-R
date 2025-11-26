import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlanFeatures } from "./plan-features";
import { updateSubscription } from "@/services/subscription-service";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import type { Plan } from "@/types/subscription";

interface SubscriptionPlansProps {
  plans: Plan[];
  currentPlanCode?: string;
  isActive?: boolean;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  plans,
  currentPlanCode,
  isActive = false,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = (plan: Plan) => {
    if (plan.code === currentPlanCode) return;
    setSelectedPlan(plan);
    setPaymentDialogOpen(true);
  };

  const closePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    try {
      const success = await updateSubscription(selectedPlan.code);

      if (success) {
        toast({
          title: "Subscription updated",
          description: `Your subscription has been successfully updated to ${selectedPlan.name}`,
          variant: "default",
        });
        // Refresh the page to get the updated subscription

        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast({
          title: "Error updating subscription",
          description:
            "There was an error updating your subscription. Please try again or contact support.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment processing error",
        description:
          "There was an error processing your payment. Please try again or use a different payment method.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setPaymentDialogOpen(false);
    }
  };

  // Sort plans by price
  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-xl font-bold">Available Plans</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Choose the plan that&apos;`s right for you
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setCompareMode(!compareMode)}
            className="hidden md:flex"
          >
            {compareMode ? "Card View" : "Compare Plans"}
          </Button>
        </motion.div>

        {!compareMode ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedPlans.map((plan) => (
              <motion.div key={plan._id} variants={itemVariants}>
                <Card
                  className={`h-full flex flex-col relative overflow-hidden
                    ${
                      plan.metadata?.popularChoice
                        ? "border-indigo-500 dark:border-indigo-400 ring-1 ring-indigo-500 dark:ring-indigo-400"
                        : ""
                    }`}
                >
                  {plan.metadata?.popularChoice && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 transform rotate-45 translate-x-6 -translate-y-1">
                        Popular
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    {plan.metadata?.popularChoice && (
                      <Badge className="w-fit mb-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                        Popular Choice
                      </Badge>
                    )}
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.metadata?.recommendedFor || "All businesses"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow pb-6">
                    <div className="mb-4">
                      <p className="text-3xl font-bold">
                        {plan.price === 0
                          ? "Free"
                          : `${plan.price.toLocaleString()} ${plan.currency}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        per {plan.billingCycle}
                      </p>
                    </div>
                    <PlanFeatures plan={plan} />
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${
                        currentPlanCode === plan.code
                          ? "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 cursor-default"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                      disabled={currentPlanCode === plan.code}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {currentPlanCode === plan.code
                        ? "Current Plan"
                        : isActive
                        ? "Change to This Plan"
                        : "Select Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium py-4 pr-4 w-1/4">
                        Features
                      </th>
                      {sortedPlans.map((plan) => (
                        <th
                          key={plan._id}
                          className="text-center font-medium py-4 px-2"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <span>{plan.name}</span>
                            <span className="font-bold text-lg">
                              {plan.price === 0
                                ? "Free"
                                : `${plan.price.toLocaleString()} ${
                                    plan.currency
                                  }`}
                            </span>
                            <span className="text-xs text-gray-500">
                              per {plan.billingCycle}
                            </span>
                            <Button
                              className={`mt-2 px-3 py-1 h-auto text-xs ${
                                currentPlanCode === plan.code
                                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 cursor-default"
                                  : "bg-indigo-600 hover:bg-indigo-700"
                              }`}
                              disabled={currentPlanCode === plan.code}
                              onClick={() => handleSelectPlan(plan)}
                            >
                              {currentPlanCode === plan.code
                                ? "Current"
                                : "Select"}
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(sortedPlans[0]?.features || {}).map(
                      (featureKey) => (
                        <tr
                          key={featureKey}
                          className="border-b last:border-b-0"
                        >
                          <td className="py-4 pr-4 text-left font-medium">
                            {sortedPlans[0]?.features[featureKey]
                              ?.description || featureKey}
                          </td>
                          {sortedPlans.map((plan) => {
                            const feature = plan.features[featureKey];
                            let displayValue;

                            if (feature?.type === "boolean") {
                              displayValue = feature.value ? (
                                <Check className="mx-auto h-5 w-5 text-green-500" />
                              ) : (
                                <X className="mx-auto h-5 w-5 text-red-500" />
                              );
                            } else if (feature?.type === "number") {
                              displayValue =
                                feature.value === null ? (
                                  <span className="font-medium">Unlimited</span>
                                ) : (
                                  feature.value
                                );
                            } else if (
                              feature?.type === "array" &&
                              Array.isArray(feature.value)
                            ) {
                              displayValue = feature.value.join(", ");
                            } else {
                              displayValue = "N/A";
                            }

                            return (
                              <td
                                key={`${plan._id}-${featureKey}`}
                                className="py-4 px-2 text-center"
                              >
                                {displayValue}
                              </td>
                            );
                          })}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      <Dialog open={paymentDialogOpen} onOpenChange={closePaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Subscription</DialogTitle>
            <DialogDescription>
              {isActive
                ? "You are about to change your subscription plan"
                : "You are about to subscribe to a new plan"}
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Selected Plan
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-lg">{selectedPlan.name}</div>
                  <div className="font-bold">
                    {selectedPlan.price === 0
                      ? "Free"
                      : `${selectedPlan.price.toLocaleString()} ${
                          selectedPlan.currency
                        }`}
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Billed {selectedPlan.billingCycle}
                </div>
              </div>

              {isActive && currentPlanCode !== selectedPlan.code && (
                <Alert
                  variant="warning"
                  className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                >
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Changing your plan will take effect immediately. You will be
                    charged the difference if upgrading or credited if
                    downgrading.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <div className="text-sm font-medium">Payment Method</div>
                <RadioGroup defaultValue="card">
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="card" id="card" />
                    <label
                      htmlFor="card"
                      className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit/Debit Card
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={closePaymentDialog}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Processing...
                </>
              ) : isActive ? (
                "Update Subscription"
              ) : (
                "Subscribe Now"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
