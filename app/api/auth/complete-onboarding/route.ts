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
        { error: "Only seller accounts have onboarding" },
        { status: 403 }
      );
    }

    // Call API to complete onboarding
    await apiClient.post(
      "/api/v1/resellers/onboard",
      {
        businessId: session.user.businessId,
      },
      {
        requireBusiness: true,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Complete onboarding error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to complete onboarding",
      },
      { status: 500 }
    );
  }
}
