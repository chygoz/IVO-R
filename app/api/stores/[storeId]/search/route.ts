import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/api-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const { storeId } = await params;

    if (!query || !storeId) {
      return NextResponse.json({
        status: "ok",
        data: { results: [] },
      });
    }

    // Search products using your API
    const response = await apiClient.get("/api/v1/products", {
      params: {
        business: storeId,
        q: query,
        limit: 10, // Limit search results
      },
      requireAuth: false,
    });

    if (response.status === "ok") {
      // Transform the products for search results
      const searchResults = response.data.results.map((product: any) => ({
        id: product._id,
        name: product.name,
        price: parseFloat(product.basePrice.value),
        image:
          product.variants?.[0]?.gallery?.[0]?.url ||
          "/placeholder-product.jpg",
        type: "product",
        slug: product.slug,
      }));

      return NextResponse.json({
        status: "ok",
        results: searchResults,
      });
    }

    return NextResponse.json({
      status: "ok",
      results: [],
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({
      status: "ok",
      results: [],
    });
  }
}
