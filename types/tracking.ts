export interface TrackingLocation {
  address: {
    countryCode: string;
    addressLocality?: string;
  };
}

export interface TrackingEvent {
  timestamp: string;
  statusCode: string;
  status: string;
  location?: TrackingLocation;
  description: string;
}

export interface TrackingMessage {
  code: string;
  message: string;
  severity: "INFO" | "WARNING" | "ERROR";
}

export interface ShipmentDetails {
  shipmentTrackingNumber: string;
  status: string;
  statusCode?: string;
  shipmentTimestamp: string;
  origin?: {
    address: {
      countryCode: string;
      addressLocality?: string;
    };
  };
  destination?: {
    address: {
      countryCode: string;
      addressLocality?: string;
    };
  };
  estimatedDeliveryTimeframe?: {
    estimatedFrom?: string;
    estimatedThrough?: string;
  };
  service?: string;
  events: TrackingEvent[];
  productCode?: string;
  description?: string;
  shipperDetails?: {
    name: string;
    postalAddress: {
      cityName: string;
      countyName: string;
      postalCode: string;
      countryCode: string;
    };
    serviceArea: Array<{
      code: string;
      description: string;
      facilityCode?: string;
    }>;
  };
  receiverDetails?: {
    name: string;
    postalAddress: {
      cityName: string;
      countyName: string;
      postalCode: string;
      countryCode: string;
    };
    serviceArea: Array<{
      code: string;
      description: string;
      facilityCode?: string;
    }>;
  };
  totalWeight?: number;
  unitOfMeasurements?: string;
  shipperReferences?: any[];
  numberOfPieces?: number;
}

export interface TrackingResponse {
  shipments: ShipmentDetails[];
  messages?: TrackingMessage[];
}

// Simplified tracking response format for component use
export interface SimplifiedTrackingInfo {
  trackingId: string;
  currentStatus: string;
  statusCode?: string;
  originCountry?: string;
  originCity?: string;
  destinationCountry?: string;
  destinationCity?: string;
  estimatedDeliveryDate?: string;
  shipmentDate: string;
  service?: string;
  events: Array<{
    timestamp: string;
    status: string;
    statusCode: string;
    location: string;
    description: string;
  }>;
  weight?: number;
  pieces?: number;
  isDelivered: boolean;
  hasError: boolean;
  errorMessage?: string;
}
