import {
  OrderType,
  OrderDetailType,
  ShippingLabelFormData,
  PickupFormData,
  CancellationReason,
} from "@/types/order";
import { fetchAPI } from "./config";

const ORDER_BASE_URL = "/api/v1/orders";

export const OrderService = {
  // Fetch all orders with pagination and filters
  getOrders: async (
    page = 1,
    limit = 10,
    status?: string,
    search?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ orders: OrderType[]; total: number; pages: number }> => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (status && status !== "All Status") params.append("status", status);
      if (search) params.append("search", search);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetchAPI({
        url: `${ORDER_BASE_URL}/business/me?${params.toString()}`,
        includeCredential: true
      });
      if (response?.error) {
        return { orders: [], total: 0, pages: 0 };
      }
      return response;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Fetch a single order by ID
  getOrderById: async (orderId: string): Promise<OrderDetailType> => {
    try {
      const response = await fetchAPI({ url: `${ORDER_BASE_URL}/${orderId}`, includeCredential: true });
      return response;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (
    orderId: string,
    status: string
  ): Promise<OrderDetailType> => {
    try {
      const response = await fetchAPI({
        method: "PUT",
        url: `${ORDER_BASE_URL}/${orderId}/status`,
        body: { status },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      throw error;
    }
  },

  // Process refund
  processRefund: async (
    orderId: string,
    reason: string
  ): Promise<OrderDetailType> => {
    try {
      const response = await fetchAPI({
        method: "POST",
        url: `${ORDER_BASE_URL}/${orderId}/refund`,
        body: {
          reason,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error processing refund for order ${orderId}:`, error);
      throw error;
    }
  },

  // Create shipping label with DHL
  createShippingLabel: async (
    orderId: string,
    shippingDetails: ShippingLabelFormData
  ): Promise<{ trackingId: string; labelUrl: string }> => {
    try {
      const response = await fetchAPI({
        method: "POST",
        url: `${ORDER_BASE_URL}/${orderId}/shipping`,
        body: { shippingDetails },
      });
      return response;
    } catch (error) {
      console.error(
        `Error creating shipping label for order ${orderId}:`,
        error
      );
      throw error;
    }
  },

  // Export orders to CSV
  exportOrders: async (
    status?: string,
    startDate?: string,
    endDate?: string
  ): Promise<Blob> => {
    try {
      const params = new URLSearchParams();
      if (status && status !== "All Status") params.append("status", status);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetchAPI({
        url: `${ORDER_BASE_URL}/export?${params.toString()}`,
      });

      return response.data;
    } catch (error) {
      console.error("Error exporting orders:", error);
      throw error;
    }
  },

  // Schedule a pickup with DHL
  schedulePickup: async (
    orderId: string,
    pickupDetails: PickupFormData
  ): Promise<any> => {
    try {
      const response = await fetchAPI({
        method: "POST",
        url: `${ORDER_BASE_URL}/${orderId}/pickup`,
        body: pickupDetails,
      });
      return response.data;
    } catch (error) {
      console.error(`Error scheduling pickup for order ${orderId}:`, error);
      throw error;
    }
  },

  // Get pickup details
  getPickupDetails: async (orderId: string, pickupId: string): Promise<any> => {
    try {
      const response = await fetchAPI({
        url: `${ORDER_BASE_URL}/${orderId}/pickup/${pickupId}`,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error getting pickup details for order ${orderId}:`,
        error
      );
      throw error;
    }
  },

  // Cancel a pickup
  cancelPickup: async (
    orderId: string,
    pickupId: string,
    reason: CancellationReason,
    additionalInfo: string = ""
  ): Promise<any> => {
    try {
      const response = await fetchAPI({
        method: "DELETE",
        url: `${ORDER_BASE_URL}/${orderId}/pickup/${pickupId}`,
        body: {
          reason,
          additionalInfo,
          canReattempt: true, // Default to allowing reattempt
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error canceling pickup for order ${orderId}:`, error);
      throw error;
    }
  },

  // Reschedule a pickup
  reschedulePickup: async (
    orderId: string,
    pickupId: string,
    pickupDate: string,
    pickupTime: string,
    closeTime: string
  ): Promise<any> => {
    try {
      // Combine date and time into a single string
      const scheduledPickupDateAndTime = `${pickupDate}T${pickupTime}:00.000Z`;

      const response = await fetchAPI({
        method: "PUT",
        url: `${ORDER_BASE_URL}/${orderId}/pickup/${pickupId}/reschedule`,
        body: {
          scheduledPickupDateAndTime,
          closeTime,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error rescheduling pickup for order ${orderId}:`, error);
      throw error;
    }
  },

  // Cancel a shipment
  cancelShipment: async (orderId: string, shipmentId: string): Promise<any> => {
    try {
      const response = await fetchAPI({
        method: "DELETE",
        url: `${ORDER_BASE_URL}/${orderId}/shipping/${shipmentId}`,
      });
      return response.data;
    } catch (error) {
      console.error(`Error canceling shipment for order ${orderId}:`, error);
      throw error;
    }
  },

  // Get tracking details
  getTrackingDetails: async (orderId: string): Promise<any> => {
    try {
      const response = await fetchAPI({
        url: `${ORDER_BASE_URL}/${orderId}/tracking`,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error getting tracking details for order ${orderId}:`,
        error
      );
      throw error;
    }
  },
  getUserOrders: async (
    page = 1,
    limit = 10,
    status?: string,
    search?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ orders: OrderType[]; total: number; pages: number }> => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (status && status !== "all") params.append("status", status);
      if (search) params.append("search", search);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetchAPI({
        url: `${ORDER_BASE_URL}/me/?${params.toString()}`,
        includeCredential: true,
      });
      console.log(response, "main")
      if (response?.error) {
        return { orders: [], total: 0, pages: 0 };
      }
      return response;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },
};

export default OrderService;
