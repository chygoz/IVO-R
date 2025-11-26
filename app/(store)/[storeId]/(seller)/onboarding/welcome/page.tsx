"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Store,
  ShoppingBag,
  Paintbrush,
  CreditCard,
  Users,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { PROTOCOL } from "@/constants";

export default function WelcomePage() {
  const { completeOnboarding, isLoading, isInternalSeller, user } = useAuth();

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await completeOnboarding();

      if (!result.success) {
        setError(result.error || "Failed to complete setup");
      }
    } catch (error) {
      console.error("Onboarding completion error:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to Your Reseller Dashboard!
          </h1>
          <p className="text-gray-600">
            Your account setup is almost complete. Here&apos;s what you need to
            know to get started.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Quick Start Guide</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 flex">
              <div className="mr-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Store className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">Set Up Your Store</h3>
                <p className="text-sm text-gray-600">
                  Customize your store name, logo, and basic information in the
                  Store Settings page.
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 flex">
              <div className="mr-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">Add Products</h3>
                <p className="text-sm text-gray-600">
                  Start adding your products with descriptions, prices, and
                  images in the Products section.
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 flex">
              <div className="mr-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Paintbrush className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">Customize Your Theme</h3>
                <p className="text-sm text-gray-600">
                  Choose from our selection of professional templates and
                  customize colors to match your brand.
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 flex">
              <div className="mr-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">Set Up Payments</h3>
                <p className="text-sm text-gray-600">
                  Configure your payment methods and shipping settings to start
                  accepting orders.
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 flex">
              <div className="mr-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">Invite Team Members</h3>
                <p className="text-sm text-gray-600">
                  Add team members to help manage your store if needed through
                  the Team section.
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 flex">
              <div className="mr-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1">Monitor Performance</h3>
                <p className="text-sm text-gray-600">
                  Track your store&apos;s performance through the analytics
                  dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h3 className="font-medium mb-2">Your Store Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Store Name</p>
              <p className="font-medium capitalize">
                {user?.businessName || "Your Store"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Store URL</p>
              <p className="font-medium break-all">
                {`${PROTOCOL}://${user?.subdomain}.resellerivo.com`}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <Button type="submit" size="lg" className="px-8" disabled={isLoading}>
            {isLoading ? "Processing..." : "Go to Dashboard"}
          </Button>

          <p className="text-sm text-gray-500 mt-3">
            Need help?{" "}
            <Link href="/help" className="text-primary hover:underline">
              Visit our Help Center
            </Link>
          </p>
        </form>
      </motion.div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Step {isInternalSeller ? "3 of 3" : "3 of 3"}: Welcome</p>
      </div>
    </div>
  );
}
