import { fetchAPI } from "../config";
import { AnalyticsData } from "./utils";

const getAnalytics = async (): Promise<{ data: AnalyticsData | null; error?: string }> => {
    try {
        const res = await fetchAPI({ url: "/api/v1/analytics/dashboard" });

        if (!res || res.error || !res.data) {
            console.warn("Invalid analytics response", res);
            return { data: null, error: res?.error || "Invalid structure" };
        }

        console.log("Analytics fetched:", res.data);
        return { data: res.data };
    } catch (error: any) {
        console.error("Error fetching analytics dashboard:", error);
        return { data: null, error: error?.message || "Unknown error" };
    }
};

export default getAnalytics;
