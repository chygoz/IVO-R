import { useState, useEffect } from "react";
import type { Subscription } from "@/types/subscription";

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/subscription");
        const data = await response.json();

        if (data.success) {
          setSubscription(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch subscription");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  return { subscription, isLoading, error };
}
