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

export const SHIPPING_BASE_URL = "/api/v1/shippings";
