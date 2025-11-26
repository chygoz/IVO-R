"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS } from "./reseller-cache-tags";

export const invalidateResellerCache = async (params: {
  oldSubdomain?: string;
  newSubdomain?: string;
  businessId: string;
}) => {
  const { oldSubdomain, newSubdomain, businessId } = params;

  // Invalidate business-specific cache
  revalidateTag(CACHE_TAGS.RESELLER_BRANDING(businessId), "layout");
  revalidateTag(CACHE_TAGS.RESELLER_STORE(businessId), "layout");

  // Invalidate global reseller domains cache
  revalidateTag("reseller-domains", "layout");

  // If subdomain changed, invalidate both old and new domain caches
  if (oldSubdomain) {
    revalidateTag(CACHE_TAGS.RESELLER_DOMAIN(oldSubdomain), "layout");
  }

  if (newSubdomain && newSubdomain !== oldSubdomain) {
    revalidateTag(CACHE_TAGS.RESELLER_DOMAIN(newSubdomain), "layout");
  }

  // Revalidate the current path to refresh the UI
  revalidatePath("/dashboard/settings/branding", "layout");
};
