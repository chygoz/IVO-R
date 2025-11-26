// app/api/store/[storeId]/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/api-client";
import { createCartResponse } from "@/lib/api/cart-route-helper";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    const apiResponse = await apiClient.get("/api/v1/cart", {
      params: { businessId: storeId },
      requireAuth: false,
      includeAuthHeaders: true,
    });

    return createCartResponse(apiResponse);
  } catch (error) {
    console.error("Get cart API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get cart" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;
    const body = await request.json();

    const apiResponse = await apiClient.post("/api/v1/cart", body, {
      params: { businessId: storeId },
      requireAuth: false,
      includeAuthHeaders: true,
    });

    return createCartResponse(apiResponse);
  } catch (error) {
    console.error("Add to cart API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
