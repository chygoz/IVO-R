import { CACHE_TAGS } from "@/lib/cache/reseller-cache-tags";
import { fetchAPI } from "../config";
import { RESELLERS_BASE_URL } from "./config";
import { ResellersResponse } from "./types";

export const getResellerBySubdomain = async (
  subdomain: string
): Promise<ResellersResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}${RESELLERS_BASE_URL}/domains/${subdomain}`,
    {
      next: {
        tags: [CACHE_TAGS.RESELLER_DOMAIN(subdomain), "reseller-domains"],
        revalidate: 3600, // Cache for 1 hour instead of force-cache
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Error fetching reseller by subdomain:", data);
    throw new Error(data.message || "Failed to fetch reseller by subdomain");
  }

  return {
    ...data.data,
    subdomain,
  };
};

export const signResellerDocument = async () => {
  const res = await fetchAPI({
    method: "POST",
    url: `${RESELLERS_BASE_URL}/sign`,
  });

  if (res?.error) {
    throw new Error(res.details);
  }

  return res;
};
