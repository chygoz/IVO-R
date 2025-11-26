import { apiClient } from "@/lib/api/api-client";
import {
  ShippingAddress,
  ShippingRateRequest,
  ShippingRateResponse,
} from "@/types/shipping";

export const shippingAPI = {
  // Get list of cities
  getCities: async () => {
    const response = await apiClient.get("/api/v1/shippings/cities", {
      requireAuth: false,
    });

    console.log("Cities response:", response);
    return response;
  },

  // Create shipping address
  createAddress: async (address: Omit<ShippingAddress, "_id">) => {
    return apiClient.post("/api/v1/shippings/address", address, {
      requireAuth: true,
    });
  },

  // Get user shipping addresses
  getUserAddresses: async () => {
    return apiClient.get("/api/v1/shippings/address/user", {
      requireAuth: true,
    });
  },

  // Update shipping address
  updateAddress: async (id: string, address: Partial<ShippingAddress>) => {
    return apiClient.put(`/api/v1/shippings/address/${id}`, address, {
      requireAuth: true,
    });
  },

  // Delete shipping address
  deleteAddress: async (id: string) => {
    return apiClient.delete(`/api/v1/shippings/address/${id}`, {
      requireAuth: true,
    });
  },

  // Get shipping rates
  getShippingRates: async (
    businessId: string,
    rateRequest: ShippingRateRequest
  ) => {
    return apiClient.post("/api/v1/shippings/shipment/rates", rateRequest, {
      params: { businessId },
      requireAuth: false,
    });
  },
};
