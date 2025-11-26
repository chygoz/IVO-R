import { useState, useEffect } from "react";
import type { Plan } from "@/types/subscription";

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/plans");
        const data = await response.json();

        if (data.success) {
          setPlans(data.data.plans);
        } else {
          throw new Error(data.message || "Failed to fetch plans");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlans();
  }, []);

  return { plans, isLoading, error };
}
