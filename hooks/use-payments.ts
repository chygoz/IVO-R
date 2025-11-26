import { useState, useEffect } from "react";
import type { Payment } from "@/types/subscription";

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        setIsLoading(true);
        // In a real app, you would fetch this from your API
        // Mock data for example purposes
        const mockPayments: Payment[] = [
          {
            id: "pay_123",
            invoiceNumber: "INV-2025-001",
            date: "2025-04-01T00:00:00.000Z",
            amount: 500000,
            currency: "NGN",
            status: "paid",
            paymentMethod: "Card",
            transactionId: "txn_abc123",
            planName: "Pro Reseller Plan",
            periodStart: "2025-04-01T00:00:00.000Z",
            periodEnd: "2026-04-01T00:00:00.000Z",
          },
          {
            id: "pay_456",
            invoiceNumber: "INV-2024-002",
            date: "2024-04-01T00:00:00.000Z",
            amount: 250000,
            currency: "NGN",
            status: "paid",
            paymentMethod: "Card",
            transactionId: "txn_def456",
            planName: "Basic Reseller Plan",
            periodStart: "2024-04-01T00:00:00.000Z",
            periodEnd: "2025-04-01T00:00:00.000Z",
          },
        ];

        setPayments(mockPayments);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchPayments();
  }, []);

  return { payments, isLoading, error };
}
