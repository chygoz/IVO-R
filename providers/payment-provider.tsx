"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  PaymentGatewayRequest,
  PaymentGatewayResponse,
  PaymentStatus,
} from "@/types/payment";
import { initiateDirectPayment } from "@/lib/api/payment";
import { useSearchParams } from "next/navigation";

interface PaymentContextType {
  isLoading: boolean;
  error: string | null;
  paymentMethod: string | null;
  paymentStatus: PaymentStatus;
  paymentResponse: PaymentGatewayResponse | null;
  setPaymentMethod: (method: string) => void;
  processDirectPayment: (
    data: PaymentGatewayRequest
  ) => Promise<PaymentGatewayResponse>;
  resetPaymentState: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    processed: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentResponse, setPaymentResponse] =
    useState<PaymentGatewayResponse | null>(null);

  const processDirectPayment = async (
    data: PaymentGatewayRequest
  ): Promise<PaymentGatewayResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await initiateDirectPayment(data);

      if (response.status === "error") {
        setError(response.error || "Payment processing failed");
      }

      setPaymentResponse(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return { status: "error", error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPaymentState = () => {
    setIsLoading(false);
    setError(null);
    setPaymentResponse(null);
  };

  useEffect(() => {
    const status = searchParams.get("status");
    const txRef = searchParams.get("tx_ref");
    const transactionId = searchParams.get("transaction_id");

    if (status && txRef) {
      setPaymentStatus({
        processed: true,
        transactionRef: txRef,
        transactionId: transactionId || undefined,
      });
    }
  }, [searchParams]);

  const value = {
    isLoading,
    error,
    paymentMethod,
    paymentResponse,
    paymentStatus,
    setPaymentMethod,
    processDirectPayment,
    resetPaymentState,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};

export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
