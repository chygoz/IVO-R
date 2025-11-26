"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SubscriptionSkeleton,
  PlansSkeleton,
  PaymentsSkeleton,
} from "./subcription-skeleton";
import { SubscriptionOverview } from "./subscription-overview";
import { PaymentHistoryList } from "./payment-history-list";
import { SubscriptionPlans } from "./subscription-plans";
import { useSubscription } from "@/hooks/use-subscription";
import { usePayments } from "@/hooks/use-payments";
import { usePlans } from "@/hooks/use-plans";

const SubscriptionDashboard: React.FC = () => {
  const { subscription, isLoading: isLoadingSubscription } = useSubscription();
  const { payments, isLoading: isLoadingPayments } = usePayments();
  const { plans, isLoading: isLoadingPlans } = usePlans();
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Determine if any data is loading
  const isLoading =
    isLoadingSubscription || isLoadingPayments || isLoadingPlans;
  const isActive = subscription?.status === "active";

  return (
    <motion.div
      className="container mx-auto px-4 py-6 md:py-8 md:px-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Subscription Management
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Manage your subscription and payment details
        </p>
      </motion.div>

      <Tabs
        defaultValue="overview"
        className="mt-6"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {isLoadingSubscription ? (
            <SubscriptionSkeleton />
          ) : (
            <SubscriptionOverview subscription={subscription} />
          )}
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          {isLoadingPayments ? (
            <PaymentsSkeleton />
          ) : (
            <PaymentHistoryList payments={payments} />
          )}
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          {isLoadingPlans ? (
            <PlansSkeleton />
          ) : (
            <SubscriptionPlans
              plans={plans}
              currentPlanCode={subscription?.planCode}
              isActive={isActive}
            />
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SubscriptionDashboard;
