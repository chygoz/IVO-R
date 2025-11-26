"use client";

import { CheckoutErrorBoundary } from "@/components/store/checkout/checkout-error-boundary";
import { CheckoutPage } from "@/components/store/checkout/checkout-page";

export default function CheckoutPageWrapper() {
  return (
    <CheckoutErrorBoundary>
      <CheckoutPage />
    </CheckoutErrorBoundary>
  );
}
