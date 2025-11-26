// services/tracking-service.ts
import {
  TrackingResponse,
  SimplifiedTrackingInfo,
  TrackingEvent as ApiTrackingEvent,
} from "@/types/tracking";
import { SHIPPING_BASE_URL } from "./utils";
import { fetchAPI } from "../config";

/**
 * Fetches shipment tracking information from the API
 */
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

/**
 * Simplifies a complex tracking response for easier use in the UI
 */
export const simplifyTrackingData = (
  data: TrackingResponse
): SimplifiedTrackingInfo => {
  // Check if there are any shipments
  if (!data.shipments || data.shipments.length === 0) {
    return {
      trackingId: "",
      currentStatus: "Not Found",
      shipmentDate: "",
      events: [],
      isDelivered: false,
      hasError: true,
      errorMessage: "No shipment data found",
    };
  }

  const shipment = data.shipments[0];
  const hasError =
    data.messages?.some((msg) => msg.severity === "ERROR") || false;

  // Extract error message if any
  const errorMessage = hasError
    ? data.messages?.find((msg) => msg.severity === "ERROR")?.message
    : undefined;

  // Check if the shipment is delivered
  const isDelivered =
    shipment.status === "Delivered" ||
    shipment.events.some(
      (event) =>
        event.status.toLowerCase().includes("delivered") ||
        event.statusCode === "delivered"
    );

  // Simple mapping of events
  const simplifiedEvents = (shipment.events || [])
    .map((event) => ({
      timestamp: event.timestamp,
      status: event.status,
      statusCode: event.statusCode || "",
      location: getEventLocation(event),
      description: event.description,
    }))
    .sort(
      (a, b) =>
        // Sort by timestamp (newest first)
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  // Get estimated delivery date
  const estimatedDeliveryDate =
    shipment.estimatedDeliveryTimeframe?.estimatedThrough ||
    shipment.estimatedDeliveryTimeframe?.estimatedFrom;

  return {
    trackingId: shipment.shipmentTrackingNumber,
    currentStatus: shipment.status,
    statusCode: shipment.statusCode,
    originCountry:
      shipment.origin?.address.countryCode ||
      shipment.shipperDetails?.postalAddress.countryCode,
    originCity:
      shipment.origin?.address.addressLocality ||
      shipment.shipperDetails?.serviceArea[0]?.description,
    destinationCountry:
      shipment.destination?.address.countryCode ||
      shipment.receiverDetails?.postalAddress.countryCode,
    destinationCity:
      shipment.destination?.address.addressLocality ||
      shipment.receiverDetails?.serviceArea[0]?.description,
    estimatedDeliveryDate,
    shipmentDate: shipment.shipmentTimestamp,
    service: shipment.service,
    events: simplifiedEvents,
    weight: shipment.totalWeight,
    pieces: shipment.numberOfPieces,
    isDelivered,
    hasError,
    errorMessage,
  };
};

/**
 * Extracts a readable location string from an event
 */
const getEventLocation = (event: ApiTrackingEvent): string => {
  if (!event.location) return "";

  const city = event.location.address.addressLocality;
  const country = event.location.address.countryCode;

  if (city && country) {
    return `${city}, ${country}`;
  } else if (city) {
    return city;
  } else if (country) {
    return country;
  }

  return "";
};

/**
 * Gets an appropriate CSS class for a given status
 */
export const getStatusClass = (
  status: string,
  isDelivered: boolean
): string => {
  if (isDelivered) return "bg-green-100 text-green-800";

  const normalizedStatus = status.toLowerCase();

  if (
    normalizedStatus.includes("transit") ||
    normalizedStatus.includes("shipment")
  ) {
    return "bg-blue-100 text-blue-800";
  } else if (
    normalizedStatus.includes("process") ||
    normalizedStatus.includes("pending")
  ) {
    return "bg-yellow-100 text-yellow-800";
  } else if (normalizedStatus.includes("out for delivery")) {
    return "bg-purple-100 text-purple-800";
  } else if (
    normalizedStatus.includes("failed") ||
    normalizedStatus.includes("exception")
  ) {
    return "bg-red-100 text-red-800";
  } else if (normalizedStatus.includes("success")) {
    return "bg-green-100 text-green-800";
  }

  return "bg-gray-100 text-gray-800";
};
