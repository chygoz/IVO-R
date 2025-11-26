import { NextRequest, NextResponse } from "next/server";

import { apiClient } from "@/lib/api/api-client";

export async function GET(request: NextRequest) {
  try {
    const session = await apiClient.get("/api/v1/auth/session");

    return NextResponse.json(session);
  } catch (error) {
    console.error("failed to get session error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process agreement",
      },
      { status: 500 }
    );
  }
}
