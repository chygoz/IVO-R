import { PaymentMethod } from "@/types/payment";

/**
 * Available payment methods
 */
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "direct",
    name: "Direct Payment",
    description: "Pay directly using our secure payment gateway",
    icon: "credit-card",
  },
];

/**
 * Payment statuses
 */
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  PAYMENT_GATEWAY: `/api/v1/payments/initiate`,
  PAYMENT_LINK: `/api/v1/payment/links`,
};
