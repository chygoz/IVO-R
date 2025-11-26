import { apiClient } from "@/lib/api/api-client";
import { IOrder } from "@/types/orders";

export const ordersAPI = {
  // Create order
  createOrder: async (data: {
    shippingId: string;
    businessId: string;
    idempotencyKey?: string;
  }): Promise<{
    success: boolean;
    order: IOrder;
    message: string;
  }> => {
    const { businessId, ...rest } = data;
    return apiClient.post(`/api/v1/orders?businessId=${businessId}`, rest, {
      params: { businessId },
      requireAuth: true,
    });
  },

  // Process payment
  processPayment: async (data: {
    orderId: string;
    businessId: string;
    transactionId: string;
  }): Promise<{
    success: boolean;
    order: IOrder;
    message: string;
  }> => {
    return apiClient.post(`/api/v1/orders/${data.orderId}/payment`, data, {
      requireAuth: true,
    });
  },
};
