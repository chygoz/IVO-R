"use client";

import { useQuery } from "@tanstack/react-query";
import { TimeRange } from "@/components/dashboard/types";
import { toast } from "@/components/ui/use-toast";
import { getAnalytics } from "@/actions/analytics";
import { AnalyticsData } from "@/components/analytics/types";

/**
 * Custom hook to fetch analytics data using Tanstack Query
 */
export function useAnalyticsData(timeRange: TimeRange) {
  return useQuery<AnalyticsData, Error>({
    queryKey: ["analytics", timeRange],
    queryFn: async () => {
      try {
        const data = await getAnalytics({ timeRange });
        if (!data?.success) {
          throw new Error(data?.message);
        }
        return data.data;
      } catch (error) {
        //@ts-expect-error
        toast.error({
          title: "Error loading analytics data",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
        throw error;
      }
    },
  });
}

/**
 * Hook for fetching only total sales data
 */
export function useTotalSalesData(timeRange: TimeRange) {
  return useQuery<AnalyticsData["totalSales"], Error>({
    queryKey: ["analytics", "totalSales", timeRange],
    queryFn: async () => {
      try {
        const data = await getAnalytics({ timeRange });
        if (!data?.success) {
          throw new Error(data?.message);
        }
        return data.data.totalSales;
      } catch (error) {
        //@ts-expect-error
        toast.error({
          title: "Error loading sales data",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
        throw error;
      }
    },
  });
}

/**
 * Hook for fetching only categories data
 */
export function useCategoriesData(timeRange: TimeRange) {
  return useQuery<AnalyticsData["categories"], Error>({
    queryKey: ["analytics", "categories", timeRange],
    queryFn: async () => {
      try {
        const data = await getAnalytics({ timeRange });
        if (!data?.success) {
          throw new Error(data?.message);
        }
        return data.data.categories;
      } catch (error) {
        //@ts-expect-error
        toast.error({
          title: "Error loading categories data",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
        throw error;
      }
    },
  });
}

/**
 * Hook for fetching only top selling products data
 */
export function useTopSellingProductsData(timeRange: TimeRange) {
  return useQuery<AnalyticsData["topSellingProducts"], Error>({
    queryKey: ["analytics", "topSellingProducts", timeRange],
    queryFn: async () => {
      try {
        const data = await getAnalytics({ timeRange });
        if (!data?.success) {
          throw new Error(data?.message);
        }
        return data.data.topSellingProducts;
      } catch (error) {
        //@ts-expect-error
        toast.error({
          title: "Error loading top products data",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
        throw error;
      }
    },
  });
}

/**
 * Hook for fetching only sales by location data
 */
export function useSalesByLocationData(timeRange: TimeRange) {
  return useQuery<AnalyticsData["salesByLocation"], Error>({
    queryKey: ["analytics", "salesByLocation", timeRange],
    queryFn: async () => {
      try {
        const data = await getAnalytics({ timeRange });
        if (!data?.success) {
          throw new Error(data?.message);
        }
        return data.data.salesByLocation;
      } catch (error) {
        //@ts-expect-error
        toast.error({
          title: "Error loading location data",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
        throw error;
      }
    },
  });
}

/**
 * Hook for fetching only orders data
 */
export function useTotalOrdersData(timeRange: TimeRange) {
  return useQuery<AnalyticsData["totalOrders"], Error>({
    queryKey: ["analytics", "totalOrders", timeRange],
    queryFn: async () => {
      try {
        const data = await getAnalytics({ timeRange });
        if (!data?.success) {
          throw new Error(data?.message);
        }

        return data.data.totalOrders;
      } catch (error) {
        //@ts-expect-error
        toast.error({
          title: "Error loading orders data",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
        throw error;
      }
    },
  });
}

/**
 * Hook for fetching only conversion rate data
 */
export function useConversionRateData(timeRange: TimeRange) {
  return useQuery<AnalyticsData["conversionRate"], Error>({
    queryKey: ["analytics", "conversionRate", timeRange],
    queryFn: async () => {
      try {
        const data = await getAnalytics({ timeRange });
        if (!data?.success) {
          throw new Error(data?.message);
        }
        return data.data.conversionRate;
      } catch (error) {
        //@ts-expect-error
        toast.error({
          title: "Error loading conversion data",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
        throw error;
      }
    },
  });
}

/**
 * Hook for fetching only reseller stores data
 */
export function useResellerStoresData(timeRange: TimeRange) {
  return useQuery<AnalyticsData["resellerStores"], Error>({
    queryKey: ["analytics", "resellerStores", timeRange],
    queryFn: async () => {
      try {
        const data = await getAnalytics({ timeRange });
        if (!data?.success) {
          throw new Error(data?.message);
        }
        return data.data.resellerStores;
      } catch (error) {
        //@ts-expect-error
        toast.error({
          title: "Error loading reseller stores data",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
        throw error;
      }
    },
  });
}

/**
 * Hook for fetching only best reseller stores data
 */
export function useBestResellerStoresData(timeRange: TimeRange) {
  return useQuery<AnalyticsData["bestResellerStores"], Error>({
    queryKey: ["analytics", "bestResellerStores", timeRange],
    queryFn: async () => {
      try {
        const data = await getAnalytics({ timeRange });
        if (!data?.success) {
          throw new Error(data?.message);
        }
        return data.data.bestResellerStores;
      } catch (error) {
        //@ts-expect-error
        toast.error({
          title: "Error loading best reseller data",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
        throw error;
      }
    },
  });
}
