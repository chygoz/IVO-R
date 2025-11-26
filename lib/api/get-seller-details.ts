"use server";

import { apiClient } from "./api-client";

export async function getSellerDetails(businessId: string) {
  try {
    const res = await apiClient.seller.get(
      `/api/v1/resellers/${businessId}/details`
    );

    console.log("res", res);
    return res.data;
  } catch (error) {
    console.error("Error fetching seller details:", error);
    return null;
  }
}
