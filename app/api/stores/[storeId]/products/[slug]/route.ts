import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/api-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; slug: string }> }
) {
  try {
    const { slug, storeId } = await params;

    const response = await apiClient.get(
      `/api/v1/products/${slug}?storeId=${storeId}`,
      {
        requireAuth: false,
      }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Product detail API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
