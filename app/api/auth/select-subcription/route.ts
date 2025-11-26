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
        { error: "Only seller accounts can select subscriptions" },
        { status: 403 }
      );
    }

    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: "Subscription plan ID is required" },
        { status: 400 }
      );
    }

    // Call API to process subscription
    await apiClient.post(
      "/auth/seller/subscription",
      {
        businessId: session.user.businessId,
        planId,
      },
      {
        requireBusiness: true,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process subscription",
      },
      { status: 500 }
    );
  }
}
