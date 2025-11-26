// hooks/use-tracking.ts
import { useState, useEffect } from "react";
import { TrackingResponse, SimplifiedTrackingInfo } from "@/types/tracking";
import {
  fetchShipmentTracking,
  simplifyTrackingData,
} from "@/actions/shipping/tracking";

interface UseTrackingProps {
  trackingId: string | undefined;
  autoFetch?: boolean;
}

interface UseTrackingReturn {
  trackingData: TrackingResponse | null;
  tracking: SimplifiedTrackingInfo | null;
  loading: boolean;
  error: string | null;
  fetchTracking: () => Promise<void>;
}

export const useTracking = ({
  trackingId,
  autoFetch = true,
}: UseTrackingProps): UseTrackingReturn => {
  const [trackingData, setTrackingData] = useState<TrackingResponse | null>(
    null
  );
  const [tracking, setTracking] = useState<SimplifiedTrackingInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (): Promise<void> => {
    if (!trackingId) {
      setError("No tracking ID provided");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchShipmentTracking(trackingId);
      setTrackingData(data);

      const simplifiedData = simplifyTrackingData(data);

      if (simplifiedData.hasError) {
        setError(
          simplifiedData.errorMessage || "Could not find tracking information"
        );
      } else {
        setTracking(simplifiedData);
      }
    } catch (err) {
      console.error("Error fetching tracking information:", err);
      setError("Could not load tracking information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingId && autoFetch) {
      fetchTracking();
    }
  }, [trackingId]);

  return {
    trackingData,
    tracking,
    loading,
    error,
    fetchTracking,
  };
};
