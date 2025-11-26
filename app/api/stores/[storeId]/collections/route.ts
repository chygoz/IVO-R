import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/api-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    // Make API call using your client
    const response = await apiClient.get("/api/v1/collections", {
      params: {
        business: storeId,
      },
      requireAuth: false,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Collections API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch collections",
      },
      { status: 500 }
    );
  }
}
