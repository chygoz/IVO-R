import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    // Get the current auth session
    const session = await auth();

    // Return simplified status data
    return NextResponse.json({
      authenticated: !!session,
      user: session
        ? {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
          }
        : null,
    });
  } catch (error) {
    console.error("Auth status error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Failed to get authentication status" },
      { status: 500 }
    );
  }
}
