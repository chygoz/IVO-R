import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { apiClient } from "@/lib/api/api-client";

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify this is a seller account
    if (session.user.role !== "seller") {
      return NextResponse.json(
        { error: "Only seller accounts can sign agreements" },
        { status: 403 }
      );
    }

    // Call API to record agreement signing
    await apiClient.post(
      "/api/v1/resellers/sign",
      {
        businessId: session.user.businessId,
      },
      {
        requireBusiness: true,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sign agreement error:", error);
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
