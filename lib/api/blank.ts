import { apiClient } from "@/lib/api/api-client";

export const blankService = {
  // Get blanks with filters
  getBlanks: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    gender?: string;
    priceMin?: string;
    priceMax?: string;
    search?: string;
    color?: string;
    size?: string;
    sort?: string;
  }) => {
    const queryParams = new URLSearchParams();

    // Add all params to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    return apiClient.seller.get(`/api/v1/blanks?${queryParams.toString()}`);
  },

  // Get blank details
  getBlankDetails: async (id: string) => {
    return apiClient.seller.get(`/api/v1/blanks/${id}`);
  },

  // Submit customized blanks
  submitCustomizedBlanks: async (data: any[]) => {
    return apiClient.seller.post("/api/v1/products/blanks", data);
  },
};
