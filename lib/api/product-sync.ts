"use client";

import { prepareProductPayload } from "@/store/product-store";

// Client-side product sync utility
export const syncProductToAPI = async (
  productId: string,
  productData: any,
  apiClient?: any
): Promise<boolean> => {
  try {
    // Get API client from window if not provided (fallback)
    let client = apiClient;

    if (!client) {
      // You might have a global API client or need to import it differently
      // This is a fallback - ideally pass the client explicitly
      const { apiClient: globalClient } = await import("@/lib/api/api-client");
      client = globalClient;
    }

    if (!client) {
      console.error("No API client available for sync");
      return false;
    }

    if (!productData || !productId) {
      console.warn("Invalid product data for sync", { productId, productData });
      return false;
    }

    const payload = prepareProductPayload(productData);
    const response = await client.seller.put(`/api/v1/products/sync`, payload);

    console.log("Sync response:", response);
    return response && response.success === true;
  } catch (error) {
    console.error("Error syncing product:", error);
    return false;
  }
};
