import { TrackingResponse } from "@/types/tracking";
import { fetchAPI } from "../config";
import { SHIPPING_BASE_URL } from "./utils";

export async function getCities(search: string = ""): Promise<{
  success: boolean;
  data: string[];
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  try {
    const params = new URLSearchParams({
      search,
      limit: "50",
      page: "1",
    });

    const response = await fetchAPI({
      url: `${SHIPPING_BASE_URL}/cities?${params.toString()}`,
    });

    if (response.error) {
      throw new Error(response.details || "Failed to fetch cities");
    }

    return response;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
}

/**
 * Interface for the service area details in the address response
 */
interface ServiceArea {
  code: string;
  description: string;
  GMTOffset: string;
}

/**
 * Interface for the address validation response with address details
 */
interface AddressValidateSuccessResponse {
  isValid: true;
  address: Array<{
    countryCode: string;
    postalCode: string;
    cityName: string;
    serviceArea: ServiceArea;
  }>;
}

/**
 * Interface for the address validation error response
 */
interface AddressValidateErrorResponse {
  isValid: false;
  detail: string;
  message: string;
}

/**
 * Union type for possible address validation responses
 */
type AddressValidateResponse =
  | AddressValidateSuccessResponse
  | AddressValidateErrorResponse;

/**
 * Parameters required for address validation
 */
interface ValidateAddressParams {
  type: "delivery" | "pickup";
  countryCode: string;
  postalCode?: string;
  cityName: string;
  strictValidation?: boolean;
}

/**
 * Validates a shipping address using the external API
 *
 * @param params - The address parameters to validate
 * @returns A promise with the validation result
 */
export async function validateAddress(
  params: ValidateAddressParams
): Promise<AddressValidateResponse> {
  try {
    const { type, countryCode, postalCode, cityName, strictValidation } =
      params;

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("type", type);
    queryParams.append("countryCode", countryCode);

    if (postalCode) {
      queryParams.append("postalCode", postalCode);
    }

    queryParams.append("cityName", cityName);

    if (strictValidation !== undefined) {
      queryParams.append("strictValidation", strictValidation.toString());
    }

    const response = await fetchAPI({
      url: `${SHIPPING_BASE_URL}/address/validate?${queryParams.toString()}`,
    });

    if (response.error) {
      throw new Error(response.details || "Failed to validate address");
    }

    return response;
  } catch (error) {
    console.error("Error validating address:", error);
    throw error;
  }
}

export async function getUserShipping(): Promise<IShippingResponse> {
  try {
    const response = await fetchAPI({
      url: `${SHIPPING_BASE_URL}/address/user`,
    });

    if (response.error) {
      throw new Error(response.details || "Failed to fetch user shipping info");
    }

    return response;
  } catch (error) {
    console.error("Error fetching user shipping:", error);
    throw error;
  }
}

interface GetShippingRatesParams {
  cartId: string;
  shippingId: string;
  businessId: string;
}

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
      url: `${SHIPPING_BASE_URL}/shipment/rates?businessId=${businessId}`,
      body: {
        shippingId,
      },
    });

    if (response.error) {
      throw new Error(`HTTP error! status: ${response.details}`);
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

import {
  IShippingResponse,
  ShippingAddress,
  ShippingMethod,
  ShippingRateResponse,
} from "@/types/shipping";

interface CreateShippingData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip?: string;
  country: string;
  isDefault: boolean;
  type: "user" | "business";
  identifier: string;
}

export async function createShipping(data: CreateShippingData): Promise<{
  success: boolean;
  data?: ShippingAddress;
  message?: string;
}> {
  try {
    const response = await fetchAPI({
      method: "POST",
      url: `${SHIPPING_BASE_URL}/address`,
      body: data,
    });

    if (response.error) {
      throw new Error(`HTTP error! status: ${response.details}`);
    }

    const result = response;

    return {
      success: result.success || false,
      data: result.data,
      message: result.message || "Successfully created shipping address",
    };
  } catch (error) {
    console.error("Error creating shipping address:", error);

    return {
      success: false,
      message: "Failed to create shipping address",
    };
  }
}

export async function updateShipping(
  shippingId: string,
  data: Partial<CreateShippingData>
): Promise<{
  success: boolean;
  data?: ShippingAddress;
  message?: string;
}> {
  try {
    const response = await fetchAPI({
      method: "PUT",
      url: `${SHIPPING_BASE_URL}/address/${shippingId}`,
      body: data,
    });

    if (response.error) {
      throw new Error(`HTTP error! status: ${response.details}`);
    }

    const result = response;

    return {
      success: result.success || false,
      data: result.data,
      message: result.message || "Successfully updated shipping address",
    };
  } catch (error) {
    console.error("Error updating shipping address:", error);

    return {
      success: false,
      message: "Failed to update shipping address",
    };
  }
}

export const fetchShipmentTracking = async (
  trackingId: string
): Promise<TrackingResponse> => {
  try {
    const response = await fetchAPI({
      url: `${SHIPPING_BASE_URL}/shipment/tracking/${trackingId}`,
    });

    if (response.error) {
      throw new Error("Failed to fetch tracking information");
    }

    return response;
  } catch (error) {
    console.error("Error fetching tracking info:", error);
    throw error;
  }
};

// types/tracking.ts
export interface TrackingEvent {
  timestamp: string;
  location: string;
  description: string;
  status: string;
}
