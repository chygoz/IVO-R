import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/api-client";
import { PROTOCOL } from "@/constants";
import { removeDot } from "@/utils/remote-dot";
import { invalidateResellerCache } from "@/lib/cache/reseller.cache";
import { generateSubdomainFromName } from "@/lib/cache/reseller-cache-tags";

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { businessId, name: newName, ...brandingData } = data;

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    // Make the API request to update branding
    const response = await apiClient.seller.put(
      `/api/v1/resellers/branding`,
      { name: newName, ...brandingData },
      { requireBusiness: true }
    );

    // Invalidate cache with proper context
    await invalidateResellerCache({
      oldSubdomain: response.nameChanged
        ? generateSubdomainFromName(newName)
        : undefined,
      newSubdomain: response.nameChanged
        ? generateSubdomainFromName(response?.business?.name)
        : undefined,
      businessId,
    });

    // If name changed, return new URL for redirect
    if (response.nameChanged && response.business) {
      const mainDomain = removeDot(
        process.env.NEXT_PUBLIC_ROOT_DOMAIN || "resellerivo.com"
      );

      return NextResponse.json({
        ...response,
        newUrl: `${PROTOCOL}://${generateSubdomainFromName(
          response.business.name
        )}.${mainDomain}/dashboard/settings/branding`,
      });
    }

    return NextResponse.json({
      ...response,
    });
  } catch (error) {
    console.error("Error updating branding:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to update branding";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
