import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
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
import { SubscriptionStatusBadge } from "./subscription-status-badge";
import { PlanFeatures } from "./plan-features";
import type { Subscription } from "@/types/subscription";

interface SubscriptionOverviewProps {
  subscription: Subscription | null;
}

export const SubscriptionOverview: React.FC<SubscriptionOverviewProps> = ({
  subscription,
}) => {
  const isActive = subscription?.status === "active";
  const currentPlan = subscription?.planId;
  const daysLeft = subscription
    ? Math.ceil(
        (new Date(subscription.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No subscription found</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          You don&apos;t have an active subscription yet.
        </p>
        <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">
          Subscribe Now
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-none bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Current Subscription</CardTitle>
              <SubscriptionStatusBadge
                status={subscription?.status || "inactive"}
              />
            </div>
            <CardDescription>
              {isActive
                ? `Renews on ${format(
                    new Date(subscription?.renewalDate || ""),
                    "MMMM d, yyyy"
                  )}`
                : "No active subscription"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Current Plan
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {currentPlan?.name || "None"}
                  </span>
                  {isActive && currentPlan?.code && (
                    <Badge variant="outline" className="ml-2">
                      {currentPlan.code}
                    </Badge>
                  )}
                </div>
                {isActive && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {daysLeft} days remaining on your subscription
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Billing Details
                </h3>
                <div className="text-lg font-semibold">
                  {isActive && subscription?.price !== undefined ? (
                    <span>
                      {subscription.price === 0
                        ? "Free"
                        : `${subscription.price.toLocaleString()} ${
                            subscription.currency
                          }`}
                    </span>
                  ) : (
                    <span>—</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {isActive ? `Billed yearly` : "No active billing"}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex flex-col space-y-3 w-full sm:flex-row sm:space-y-0 sm:space-x-3">
              {isActive ? (
                <>
                  <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() =>
                      //@ts-expect-error
                      document.querySelector('[data-value="plans"]')?.click()
                    }
                  >
                    Change Plan
                  </Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() =>
                      //@ts-expect-error
                      document.querySelector('[data-value="payments"]')?.click()
                    }
                  >
                    View Payments
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() =>
                    //@ts-expect-error
                    document.querySelector('[data-value="plans"]')?.click()
                  }
                >
                  Subscribe Now
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {isActive && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Store Details</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Store Name
                  </h3>
                  <div className="text-lg font-semibold">
                    {subscription?.storeName || "—"}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Store URL
                  </h3>
                  <div className="text-lg font-semibold">
                    <a
                      href={`https://${subscription?.storeUrl}`}
                      className="text-indigo-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {subscription?.storeUrl || "—"}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {isActive && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <PlanFeatures plan={currentPlan} isCompact={true} />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
