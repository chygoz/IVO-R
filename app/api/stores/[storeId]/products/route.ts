import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/api-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const { storeId } = await params;

    // Extract query parameters
    const gender = searchParams.get("gender") || "";
    const query = searchParams.get("q") || "";
    const limit = searchParams.get("limit");
    const stocklevel = searchParams.get("stocklevel") || "";
    const search = searchParams.get("search") || "";
    const l = searchParams.get("limit");
    const p = searchParams.get("p");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const category = searchParams.get("category") || "";

    // Build API parameters
    const apiParams: Record<string, string | number | undefined> = {
      business: storeId,
      gender: gender || undefined,
      q: query || undefined,
      stocklevel: stocklevel || undefined,
      search: search,
      categorySlug: category,
    };

    if (limit) {
      apiParams.limit = parseInt(limit);
    }
    if (l) {
      apiParams.l = parseInt(l);
    }
    if (p) {
      apiParams.p = parseInt(p);
    }
    if (priceMin) {
      apiParams.priceMin = parseInt(priceMin);
    }
    if (priceMax) {
      apiParams.priceMax = parseInt(priceMax);
    }

    // Make API call using your client
    const response = await apiClient.get("/api/v1/products", {
      params: apiParams,
      requireAuth: false,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
