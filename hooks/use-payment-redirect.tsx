"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IOrder } from "@/types/orders";
import { ordersAPI } from "@/lib/api/orders";
import { useStore } from "@/lib/store-context";

interface PaymentRedirectState {
  isProcessing: boolean;
  paymentResult: {
    success: boolean;
    message: string;
    order?: IOrder;
  } | null;
  error: string | null;
}

export const usePaymentRedirect = (order: IOrder | null) => {
  const searchParams = useSearchParams();
  const { store } = useStore();
  const router = useRouter();

  const [state, setState] = useState<PaymentRedirectState>({
    isProcessing: false,
    paymentResult: null,
    error: null,
  });

  const processPayment = useCallback(
    async (
      status: string,
      txRef: string,
      transactionId: string
    ): Promise<void> => {
      if (!order) return;

      setState((prev) => ({ ...prev, isProcessing: true, error: null }));

      try {
        const response = await ordersAPI.processPayment({
          orderId: order.orderId,
          businessId: store.id,
          transactionId,
        });

        if (response.success) {
          setState((prev) => ({
            ...prev,
            paymentResult: {
              success: true,
              message: "Payment processed successfully",
              order: response.order,
            },
          }));

          // Clean URL without causing re-render
          const url = new URL(window.location.href);
          url.searchParams.delete("status");
          url.searchParams.delete("tx_ref");
          url.searchParams.delete("transaction_id");
          router.replace(url.pathname);
        } else {
          throw new Error("Payment processing failed");
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Payment processing failed",
        }));
      } finally {
        setState((prev) => ({ ...prev, isProcessing: false }));
      }
    },
    [order, store.id, router]
  );

  useEffect(() => {
    const status = searchParams.get("status");
    const txRef = searchParams.get("tx_ref");
    const transactionId = searchParams.get("transaction_id");
    if (
      status === "successful" &&
      txRef &&
      transactionId &&
      order &&
      !state.isProcessing
    ) {
      processPayment(status, txRef, transactionId);
    }
  }, [searchParams, order, processPayment, state.isProcessing]);

  const closePaymentModal = useCallback((): void => {
    setState((prev) => ({ ...prev, paymentResult: null, error: null }));
  }, []);

  return {
    isProcessing: state.isProcessing,
    paymentResult: state.paymentResult,
    error: state.error,
    closePaymentModal,
  };
};
