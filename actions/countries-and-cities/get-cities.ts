// utils/fetchCities.ts
import { fetchAPI } from "../config";

export async function fetchCities(): Promise<string[]> {
  try {
    const res = await fetchAPI({ url: "/api/v1/shippings/cities" });

    if (!res || !Array.isArray(res.data)) {
      throw new Error("Invalid response format. Expected an array of cities under 'data'.");
    }

    console.log("✅ Cities fetched:", res.data);
    return res.data;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch cities:", error instanceof Error ? error.message : error);
    return [];
  }
}
