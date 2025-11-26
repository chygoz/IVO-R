export interface ShippingAddress {
  type: "user" | "business";
  identifier: string;
  isDefault: boolean;
  email: string;
  _id: string;
  firstName: string;
  lastName: string;
  address: string;
  street?: string;
  city: string;
  state: string;
  zip: string;
  region: string;
  country: string;
  phone: string;
}

export interface ShippingRateRequest {
  senderAddress: ShippingAddress;
  receiverAddress: ShippingAddress;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

export interface IShippingResponse {
  success: boolean;
  message: string;
  data?: ShippingAddress[];
  error?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  deliveryTime?: string;
  estimatedDelivery?: string;
  totalTransitDays?: number;
  breakdown?: PriceBreakdown[];
  raw?: DHL_Product; // Store raw DHL data if needed
}

export interface DHL_Product {
  productName: string;
  productCode: string;
  localProductCode: string;
  localProductCountryCode: string;
  networkTypeCode: string;
  isCustomerAgreement: boolean;
  weight: {
    volumetric: number;
    provided: number;
    unitOfMeasurement: string;
  };
  totalPrice: Array<{
    currencyType: string;
    priceCurrency: string;
    price: number;
  }>;
  totalPriceBreakdown: Array<{
    currencyType: string;
    priceCurrency: string;
    priceBreakdown: Array<{
      typeCode: string;
      price: number;
    }>;
  }>;
  deliveryCapabilities: {
    deliveryTypeCode: string;
    estimatedDeliveryDateAndTime: string;
    destinationServiceAreaCode: string;
    destinationFacilityAreaCode: string;
    deliveryAdditionalDays: number;
    deliveryDayOfWeek: number;
    totalTransitDays: number;
  };
  pickupCapabilities: {
    nextBusinessDay: boolean;
    localCutoffDateAndTime: string;
    GMTCutoffTime: string;
    pickupEarliest: string;
    pickupLatest: string;
    originServiceAreaCode: string;
    originFacilityAreaCode: string;
    pickupAdditionalDays: number;
    pickupDayOfWeek: number;
  };
  detailedPriceBreakdown: any[];
  pricingDate: string;
}

export interface ShippingRateResponse {
  products: DHL_Product[];
  exchangeRates: Array<{
    currentExchangeRate: number;
    currency: string;
    baseCurrency: string;
  }>;
}

export interface PriceBreakdown {
  typeCode: string;
  description: string;
  price: number;
}

// Utility function to transform DHL response to our ShippingMethod format
export const transformShippingMethods = (
  response: ShippingRateResponse,
  preferredCurrency: string = "NGN"
): ShippingMethod[] => {
  return response.products.map((product) => {
    // Find the price for preferred currency
    const priceInfo = product.totalPrice.find(
      (p) => p.priceCurrency === preferredCurrency
    );

    // Fallback to first available currency if preferred not found
    const fallbackPrice = priceInfo || product.totalPrice[0];

    // Format delivery time
    const estimatedDelivery = new Date(
      product.deliveryCapabilities.estimatedDeliveryDateAndTime
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Create description with delivery time
    const description = `Estimated delivery by ${estimatedDelivery} (${product.deliveryCapabilities.totalTransitDays} business days)`;

    // Extract price breakdown
    const breakdown =
      product.totalPriceBreakdown
        .find((b) => b.priceCurrency === fallbackPrice.priceCurrency)
        ?.priceBreakdown.map((pb) => ({
          typeCode: pb.typeCode,
          description: pb.typeCode === "STTXA" ? "Tax" : "Base Rate",
          price: pb.price,
        })) || [];

    return {
      id: product.productCode,
      name: product.productName,
      description,
      price: fallbackPrice.price,
      currency: fallbackPrice.priceCurrency,
      deliveryTime: `${product.deliveryCapabilities.totalTransitDays} business days`,
      estimatedDelivery,
      totalTransitDays: product.deliveryCapabilities.totalTransitDays,
      breakdown,
      raw: product,
    };
  });
};
