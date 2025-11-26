"use server";

import { apiClient } from "@/lib/api/api-client";

export async function getCitiesAction(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  success: boolean;
  data: string[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.search) {
      searchParams.append("search", params.search);
    }

    searchParams.append("limit", (params?.limit || 20).toString());
    searchParams.append("page", (params?.page || 1).toString());

    const response = await apiClient.get(
      `/api/v1/shippings/cities?${searchParams.toString()}`,
      {
        requireAuth: false,
      }
    );

    if (response.success) {
      return {
        success: true,
        data: response.data,
        meta: response.meta,
      };
    }

    return {
      success: false,
      data: [],
      error: response.message || "Failed to fetch cities",
    };
  } catch (error) {
    console.error("Failed to load cities:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch cities",
    };
  }
}

export async function getUserAddressesAction(): Promise<{
  success: boolean;
  data: any[];
  error?: string;
}> {
  try {
    const response = await apiClient.get("/api/v1/shippings/address/user", {
      requireAuth: true,
    });

    if (response.success) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      data: [],
      error: response.message || "Failed to fetch addresses",
    };
  } catch (error) {
    console.error("Failed to load addresses:", error);
    return {
      success: false,
      data: [],
      error:
        error instanceof Error ? error.message : "Failed to fetch addresses",
    };
  }
}

export async function createAddressAction(address: {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  region: string;
  country: string;
  phone: string;
  type: string;
  identifier: string;
  isDefault: boolean;
}): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const response = await apiClient.post(
      "/api/v1/shippings/address",
      address,
      {
        requireAuth: true,
      }
    );

    if (response.success) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.message || "Failed to create address",
    };
  } catch (error) {
    console.error("Failed to create address:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create address",
    };
  }
}

export async function getShippingRatesAction(
  businessId: string,
  rateRequest: any
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const response = await apiClient.post(
      "/api/v1/shippings/shipment/rates",
      rateRequest,
      {
        params: { businessId },
        requireAuth: false,
        includeAuthHeaders: true,
      }
    );

    if (response.success) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.message || "Failed to get shipping rates",
    };
  } catch (error) {
    console.error("Failed to get shipping rates:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get shipping rates",
    };
  }
}
