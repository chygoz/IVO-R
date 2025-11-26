import { PaymentGatewayRequest, PaymentGatewayResponse } from "@/types/payment";
import { API_ENDPOINTS } from "@/constants/payment";
import { fetchAPI } from "@/actions/config";

/**
 * Initiate direct payment via payment gateway
 * @param paymentData - Payment request data
 * @returns Promise with payment gateway response
 */
export const initiateDirectPayment = async (
  paymentData: PaymentGatewayRequest
): Promise<PaymentGatewayResponse> => {
  try {
    const response = await fetchAPI({
      url: API_ENDPOINTS.PAYMENT_GATEWAY,
      method: "POST",
      body: paymentData,
    });

    if (response.error) {
      throw new Error(`Payment gateway error: ${response.details}`);
    }

    const data = response;
    return data as PaymentGatewayResponse;
  } catch (error) {
    console.error("Error initiating payment:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
