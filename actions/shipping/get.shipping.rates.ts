
import { fetchAPI } from "@/actions/config";
import { ShippingRateResponse } from "./utils";

type GetShippingRatesParams = {
  shippingId: number;
  businessId: string;
};

export async function getShippingRates(
  params: GetShippingRatesParams
): Promise<{
  success: boolean;
  data?: ShippingRateResponse;
  message?: string;
}> {
  try {
    const { shippingId, businessId } = params;

    const response = await fetchAPI({
      method: "POST",
      url: `/api/v1/shippings/shipment/rates?businessId=${businessId}`,
      body: {
        shippingId,
      },
    });

    if (response.error) {
      throw new Error(`HTTP error! status: ${JSON.stringify(response.details)}`);
    }

    return response;
  } catch (error) {
    console.error("Error fetching shipping rates:", error);

    return {
      success: false,
      message: "Failed to fetch shipping rates",
    };
  }
}
