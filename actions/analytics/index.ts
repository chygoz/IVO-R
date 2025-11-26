import { TimeRange } from "@/components/dashboard/types";
import { fetchAPI } from "../config";
import { CLIENT_URL } from "./util";

type Query = {
  timeRange: TimeRange;
};

export const getDashboardAnalytics = async (
  query: Query
): Promise<{ success: boolean; data?: any; message: string } | null> => {
  const res = await fetchAPI({
    url: `${CLIENT_URL}/admin/dashboard?timeRange=${query.timeRange}`,
  });

  if (res.error) {
    return { success: false, message: res.details };
  }

  return res;
};

export const getAnalytics = async (
  query: Query
): Promise<{ success: boolean; data?: any; message: string } | null> => {
  const res = await fetchAPI({
    url: `${CLIENT_URL}/admin/analytics?timeRange=${query.timeRange}`,
  });

  if (res.error) {
    return { success: false, message: res.details };
  }

  return res;
};
