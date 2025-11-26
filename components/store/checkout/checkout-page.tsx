"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store-context";
import { useCart } from "@/providers/cart-provider";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/hooks/use-checkout";
import { usePaymentRedirect } from "@/hooks/use-payment-redirect";

import { CheckoutForm } from "./checkout-form";
import { CheckoutSummary } from "./checkout-summary";
import { CheckoutLoginPrompt } from "./checkout-login-prompt";
import { PaymentSuccessModal } from "./payment-success-modal";
import { CheckoutLoading } from "./checkout-loading";
import { CheckoutProgress } from "./checkout-progress";
import { CheckoutHeader } from "./checkout-header";

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
export function CheckoutPage() {
  console.log("🔄 CheckoutPage re-render");
  const { store } = useStore();
  const { isAuthenticated } = useAuth();
  const { items, totalAmount, currency, clearCart, refreshCart } = useCart();
  const router = useRouter();

  // Custom checkout hook handles all the logic
  const { state, actions, computed } = useCheckout();

  // Payment redirect handling
  const {
    isProcessing: isProcessingPayment,
    paymentResult,
    error: paymentError,
    closePaymentModal,
  } = usePaymentRedirect(state.createdOrder);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !paymentResult?.success && !state.createdOrder) {
      router.push("/cart");
    }
  }, [items, paymentResult, state.createdOrder, router]);

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return <CheckoutLoginPrompt />
  }
  // Show success modal
  if (paymentResult?.success) {
    return (
      <PaymentSuccessModal
        order={paymentResult.order as Order | undefined | null}
        onClose={() => {
          closePaymentModal();
          clearCart();
          router.push("/");
        }}
      />
    );
  }

  // Show loading during processing
  if (state.isProcessingOrder || isProcessingPayment) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: store.colors.background }}
      >
        <CheckoutLoading
          stage={isProcessingPayment ? "processing" : "creating"}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: store.colors.background }}
    >
      {/* Mobile Header */}
      <CheckoutHeader
        onBack={() => router.back()}
        step={state.step}
        itemCount={items.length}
      />

      {/* Hero Section */}
      <motion.section
        className="py-8 md:py-12"
        style={{ backgroundColor: store.colors.primary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1
              className="text-3xl md:text-5xl font-bold uppercase mb-4"
              style={{ color: store.colors.background }}
            >
              Checkout
            </h1>
            <CheckoutProgress
              //@ts-expect-error
              currentStep={state.step}
              completedSteps={computed.completedSteps}
            />
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        <AnimatePresence>
          {(state.error || paymentError) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{state.error || paymentError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <CheckoutForm
              step={state.step}
              shippingAddress={state.shippingAddress}
              billingAddress={state.billingAddress}
              useSameAddress={state.useSameAddress}
              savedAddresses={state.savedAddresses}
              cities={state.cities}
              shippingRates={state.shippingRates}
              selectedShippingRate={state.selectedShippingRate}
              isLoadingRates={state.isLoadingRates}
              onShippingAddressChange={actions.handleShippingAddressChange}
              onBillingAddressChange={actions.setBillingAddress}
              onUseSameAddressChange={actions.setUseSameAddress}
              onShippingRateSelect={actions.setSelectedShippingRate}
              onProceedToPayment={actions.handleProceedToPayment}
              onPlaceOrder={actions.handlePlaceOrder}
              calculateShippingRates={actions.calculateShippingRates}
              isProcessing={state.isProcessingOrder}
              items={items}
              subtotal={totalAmount}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              items={items}
              subtotal={totalAmount}
              currency={currency}
              selectedShippingRate={state.selectedShippingRate}
              step={state.step}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
