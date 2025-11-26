import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/api-client";

export async function GET(request: NextRequest) {
  try {
    const response = await apiClient.seller.get("/api/v1/products/updates");

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching product updates:", error);
    return NextResponse.json(
      { error: "Failed to fetch product updates" },
      { status: 500 }
    );
  }
}
